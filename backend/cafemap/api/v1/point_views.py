"""
統合ポイントAPI

カフェとカスタム地点を統一的に扱うAPI
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

from cafemap.models import Map, CafeMapRelation, CustomPlaceMapRelation
from cafemap.serializers.point_serializer import (
    UnifiedPointSerializer,
    MapPointsResponseSerializer
)


class MapPointsView(APIView):
    """
    マップに紐づくすべての地点（カフェ+カスタム地点）を返すAPI

    統合APIエンドポイント（フェーズ2）
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="マップの全地点を取得",
        description="""
        指定されたマップに紐づくすべての地点（カフェとカスタム地点）を統合して取得します。

        ## クエリパラメータ
        - `fields`: "basic" (デフォルト) または "detailed"
          - basic: マップ表示に必要な最小限の情報のみ
          - detailed: 詳細情報を含む
        - `visible_only`: "true" または "false" (デフォルト)
          - true: 表示中のカスタム地点のみ取得
          - false: すべてのカスタム地点を取得

        ## レスポンス
        統合されたポイントリストを返します。各ポイントには `type` フィールドがあり、
        "cafe" または "custom_place" で種類を判別できます。
        """,
        parameters=[
            OpenApiParameter(
                name='fields',
                type=str,
                location=OpenApiParameter.QUERY,
                description='取得する情報の詳細度 (basic/detailed)',
                required=False,
                default='basic',
            ),
            OpenApiParameter(
                name='visible_only',
                type=bool,
                location=OpenApiParameter.QUERY,
                description='表示中のカスタム地点のみ取得するか',
                required=False,
                default=False,
            ),
        ],
        responses={
            200: OpenApiResponse(
                response=MapPointsResponseSerializer,
                description='統合ポイント一覧',
            ),
            404: OpenApiResponse(description='マップが見つかりません'),
        },
        tags=['Points (統合API)'],
    )
    def get(self, request, map_id):
        """
        GET /api/v1/maps/{map_id}/points/

        マップに紐づくすべての地点を取得
        """
        # マップの存在確認
        map_obj = get_object_or_404(Map, id=map_id)

        # クエリパラメータ取得
        fields = request.query_params.get('fields', 'basic')
        visible_only = request.query_params.get('visible_only', 'false').lower() == 'true'
        include_details = fields == 'detailed'

        points = []

        # カフェを取得
        cafe_relations = CafeMapRelation.objects.filter(
            map=map_obj
        ).select_related('cafe')

        for relation in cafe_relations:
            point_data = UnifiedPointSerializer.from_cafe(
                relation.cafe,
                include_details=include_details,
                request=request
            )
            points.append(point_data)

        # カスタム地点を取得
        custom_place_query = CustomPlaceMapRelation.objects.filter(map=map_obj)

        if visible_only:
            custom_place_query = custom_place_query.filter(is_visible=True)

        custom_place_relations = custom_place_query.select_related(
            'custom_place',
            'custom_place__owner'
        )

        for relation in custom_place_relations:
            point_data = UnifiedPointSerializer.from_custom_place(
                relation.custom_place,
                include_details=include_details,
                request=request
            )
            # is_visible は常に含める
            point_data['is_visible'] = relation.is_visible
            points.append(point_data)

        # レスポンス構築
        response_data = {
            'map': {
                'id': map_obj.id,
                'name': map_obj.name,
            },
            'points': points,
            'total_count': len(points),
            'cafe_count': len([p for p in points if p['type'] == 'cafe']),
            'custom_place_count': len([p for p in points if p['type'] == 'custom_place']),
        }

        return Response(response_data, status=status.HTTP_200_OK)
