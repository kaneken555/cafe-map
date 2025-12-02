"""
統合ポイント型定義

カフェとカスタム地点を統一的に扱うための型定義
"""
from typing import Literal, TypedDict, Optional, List

# ポイントの種類
PointType = Literal["cafe", "custom_place"]


class BasePointDict(TypedDict):
    """地点の基本情報（マップ表示用）"""
    type: PointType
    id: int
    name: str
    latitude: float
    longitude: float
    image_url: Optional[str]


class CafePointDict(BasePointDict):
    """カフェポイントの詳細情報"""
    place_id: str
    rating: Optional[float]
    user_ratings_total: Optional[int]
    photo_urls: Optional[List[str]]
    address: Optional[str]
    phone_number: Optional[str]
    opening_hours: Optional[str]
    website: Optional[str]
    price_level: Optional[int]


class CustomPlacePointDict(BasePointDict):
    """カスタム地点ポイントの詳細情報"""
    owner: dict  # {"id": int, "name": str}
    place_type: Optional[str]
    place_type_display: Optional[str]
    memo: Optional[str]
    created_at: str
    updated_at: str
    is_visible: bool
