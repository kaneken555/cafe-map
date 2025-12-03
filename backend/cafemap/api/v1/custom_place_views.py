from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from cafemap.models import CustomPlace, CustomPlaceMapRelation, Map, MapUserRelation
from cafemap.serializers import CustomPlaceSerializer, CustomPlaceMapRelationSerializer

import logging

logger = logging.getLogger(__name__)


class CustomPlaceViewSet(viewsets.ModelViewSet):
    """カスタム地点 ViewSet"""

    permission_classes = [IsAuthenticated]
    serializer_class = CustomPlaceSerializer

    def get_queryset(self):
        """自分が作成したカスタム地点のみ取得"""
        return CustomPlace.objects.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        """カスタム地点を作成"""
        # デバッグログ: リクエストデータの内容を確認
        logger.info(f"受信したリクエストデータのキー: {list(request.data.keys())}")
        map_ids_value = request.data.get('map_ids')
        logger.info(f"map_ids の値: '{map_ids_value}', 型: {type(map_ids_value)}")

        # request.dataをそのまま使用（シリアライザーでJSONパースを処理）
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"カスタム地点作成のバリデーションエラー: {serializer.errors}")
            logger.error(f"受信データ: {dict(request.data)}")
        serializer.is_valid(raise_exception=True)

        # map_ids を先に取得（save() で削除される前に）
        map_ids = serializer.validated_data.get('map_ids', [])
        logger.info(f"マップへの関連付け対象: {map_ids}")

        # 所有者を自動設定
        custom_place = serializer.save(owner=request.user)
        if map_ids:
            for map_id in map_ids:
                try:
                    map_obj = Map.objects.get(id=map_id)
                    # マップへのアクセス権限を確認
                    if MapUserRelation.objects.filter(
                        map=map_obj,
                        user=request.user
                    ).exists():
                        CustomPlaceMapRelation.objects.get_or_create(
                            map=map_obj,
                            custom_place=custom_place
                        )
                    else:
                        logger.warning(
                            f"User {request.user.id} attempted to add custom place "
                            f"to map {map_id} without permission"
                        )
                except Map.DoesNotExist:
                    logger.warning(f"Map {map_id} does not exist")
                    continue

        # レスポンス用にシリアライザーを再取得
        response_serializer = self.get_serializer(custom_place)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """カスタム地点を更新"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # 所有者チェックは get_queryset でフィルタ済み
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """カスタム地点を削除"""
        instance = self.get_object()
        # 所有者チェックは get_queryset でフィルタ済み
        # CustomPlaceMapRelation は CASCADE で自動削除される
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='by-map/(?P<map_id>[^/.]+)')
    def by_map(self, request, map_id=None):
        """マップ内のカスタム地点取得"""
        try:
            map_obj = get_object_or_404(Map, id=map_id)

            # マップへのアクセス権限を確認
            if not MapUserRelation.objects.filter(
                map=map_obj,
                user=request.user
            ).exists():
                return Response(
                    {"error": "このマップへのアクセス権限がありません"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # マップに関連するカスタム地点を取得
            relations = CustomPlaceMapRelation.objects.filter(
                map=map_obj,
                is_visible=True
            ).select_related('custom_place', 'custom_place__owner')

            custom_places = [rel.custom_place for rel in relations]
            serializer = self.get_serializer(custom_places, many=True)

            return Response({
                'map': {
                    'id': map_obj.id,
                    'name': map_obj.name
                },
                'custom_places': serializer.data
            })

        except Map.DoesNotExist:
            return Response(
                {"error": "マップが見つかりません"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'], url_path='maps/(?P<map_id>[^/.]+)/add')
    def add_to_map(self, request, map_id=None):
        """既存のカスタム地点をマップに関連付け"""
        try:
            map_obj = get_object_or_404(Map, id=map_id)

            # マップへのアクセス権限を確認
            if not MapUserRelation.objects.filter(
                map=map_obj,
                user=request.user
            ).exists():
                return Response(
                    {"error": "このマップへのアクセス権限がありません"},
                    status=status.HTTP_403_FORBIDDEN
                )

            custom_place_id = request.data.get('custom_place_id')
            if not custom_place_id:
                return Response(
                    {"error": "custom_place_idは必須です"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # カスタム地点を取得（自分の地点のみ）
            custom_place = get_object_or_404(
                CustomPlace,
                id=custom_place_id,
                owner=request.user
            )

            # 関連を作成（既に存在する場合は取得）
            relation, created = CustomPlaceMapRelation.objects.get_or_create(
                map=map_obj,
                custom_place=custom_place
            )

            serializer = CustomPlaceMapRelationSerializer(relation)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )

        except Map.DoesNotExist:
            return Response(
                {"error": "マップが見つかりません"},
                status=status.HTTP_404_NOT_FOUND
            )
        except CustomPlace.DoesNotExist:
            return Response(
                {"error": "カスタム地点が見つかりません"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(
        detail=False,
        methods=['delete'],
        url_path='maps/(?P<map_id>[^/.]+)/remove/(?P<custom_place_id>[^/.]+)'
    )
    def remove_from_map(self, request, map_id=None, custom_place_id=None):
        """マップからカスタム地点の関連を削除"""
        try:
            map_obj = get_object_or_404(Map, id=map_id)

            # マップへのアクセス権限を確認
            if not MapUserRelation.objects.filter(
                map=map_obj,
                user=request.user
            ).exists():
                return Response(
                    {"error": "このマップへのアクセス権限がありません"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # 関連を削除
            relation = get_object_or_404(
                CustomPlaceMapRelation,
                map=map_obj,
                custom_place_id=custom_place_id
            )
            relation.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Map.DoesNotExist:
            return Response(
                {"error": "マップが見つかりません"},
                status=status.HTTP_404_NOT_FOUND
            )
        except CustomPlaceMapRelation.DoesNotExist:
            return Response(
                {"error": "関連が見つかりません"},
                status=status.HTTP_404_NOT_FOUND
            )
