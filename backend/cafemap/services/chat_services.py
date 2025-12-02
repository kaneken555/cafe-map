import time
import logging
from typing import Optional, Dict, List
from django.conf import settings
from django.utils import timezone
from cafemap.models import ChatSession, ChatMessage, User, Map

logger = logging.getLogger(__name__)


def get_sessions_for_user(user: User) -> List[ChatSession]:
    """
    ユーザーのチャットセッション一覧を取得

    Args:
        user: ユーザーオブジェクト

    Returns:
        チャットセッションのリスト（最新順）
    """
    return ChatSession.objects.filter(
        user=user,
        is_active=True
    ).order_by('-last_message_at')


def create_session_for_user(
    user: User,
    context_type: str = 'general',
    context_data: Optional[Dict] = None,
    map_id: Optional[int] = None
) -> ChatSession:
    """
    新しいチャットセッションを作成

    Args:
        user: ユーザーオブジェクト
        context_type: コンテキストタイプ
        context_data: コンテキストデータ
        map_id: マップID（オプション）

    Returns:
        作成されたチャットセッション
    """
    map_obj = None
    if map_id:
        try:
            map_obj = Map.objects.get(id=map_id)
        except Map.DoesNotExist:
            logger.warning(f"Map with id {map_id} not found")

    session = ChatSession.objects.create(
        user=user,
        map=map_obj,
        context_type=context_type,
        context_data=context_data or {},
        title=None,  # 最初のメッセージから自動生成予定
    )

    logger.info(f"Created chat session {session.id} for user {user.name}")
    return session


def get_session_messages(
    session_id: int,
    limit: Optional[int] = None,
    offset: int = 0
) -> List[ChatMessage]:
    """
    セッション内のメッセージを取得

    Args:
        session_id: セッションID
        limit: 取得件数制限
        offset: オフセット

    Returns:
        メッセージのリスト
    """
    queryset = ChatMessage.objects.filter(session_id=session_id).order_by('created_at')

    if limit:
        queryset = queryset[offset:offset + limit]

    return list(queryset)


def delete_session(session_id: int, user: User) -> bool:
    """
    チャットセッションを削除（論理削除）

    Args:
        session_id: セッションID
        user: ユーザーオブジェクト

    Returns:
        削除に成功したかどうか
    """
    try:
        session = ChatSession.objects.get(id=session_id, user=user)
        session.is_active = False
        session.save()
        logger.info(f"Deleted session {session_id} for user {user.name}")
        return True
    except ChatSession.DoesNotExist:
        logger.warning(f"Session {session_id} not found for user {user.name}")
        return False


def create_user_message(session: ChatSession, content: str) -> ChatMessage:
    """
    ユーザーメッセージを作成

    Args:
        session: チャットセッション
        content: メッセージ内容

    Returns:
        作成されたメッセージ
    """
    message = ChatMessage.objects.create(
        session=session,
        role='user',
        content=content
    )

    # セッションの最終メッセージ時刻を更新
    session.last_message_at = timezone.now()
    session.save(update_fields=['last_message_at'])

    return message


def generate_ai_response(session: ChatSession, user_message: str) -> Dict:
    """
    AIメッセージを生成（フェーズ1: モック実装）

    Args:
        session: チャットセッション
        user_message: ユーザーメッセージ

    Returns:
        {
            "content": "AI応答テキスト",
            "tokens_used": 150,
            "response_time_ms": 1200,
            "model_name": "mock"
        }
    """
    start_time = time.time()

    # フェーズ1: モックAI応答
    # TODO: フェーズ2でOpenAI APIに置き換え
    ai_content = generate_mock_ai_response(user_message, session)

    response_time_ms = int((time.time() - start_time) * 1000)

    return {
        "content": ai_content,
        "tokens_used": len(user_message) + len(ai_content),  # 簡易計算
        "response_time_ms": response_time_ms,
        "model_name": "mock-v1"
    }


def generate_mock_ai_response(user_message: str, session: ChatSession) -> str:
    """
    モックAI応答を生成（開発用）

    実際のAI統合前のテスト用関数
    """
    message_lower = user_message.lower()

    # 挨拶への応答
    if any(greeting in message_lower for greeting in ['こんにちは', 'おはよう', 'こんばんは', 'hello', 'hi']):
        return "こんにちは！カフェマップについてお手伝いします。どのようなことをお探しですか？"

    # カフェ検索への応答
    if any(keyword in message_lower for keyword in ['カフェ', 'cafe', '探し', '検索', 'おすすめ']):
        return """カフェをお探しですね！以下のような条件で探すことができます：

• エリアを指定（例：「渋谷のカフェ」）
• 特徴を指定（例：「Wi-Fiがあるカフェ」「静かなカフェ」）
• 営業時間を指定（例：「今開いているカフェ」）

どのようなカフェをお探しですか？"""

    # 使い方への応答
    if any(keyword in message_lower for keyword in ['使い方', '方法', 'how to', 'やり方']):
        return """カフェマップアプリの使い方をご案内します：

1. **カフェの検索**: 地図上でカフェを探すか、検索バーにキーワードを入力
2. **マップに追加**: 気に入ったカフェをタップして「マップに追加」
3. **マップの管理**: 複数のマップを作成して、目的別に整理
4. **共有**: マップを友達と共有することも可能

何か具体的に知りたいことはありますか？"""

    # ありがとうへの応答
    if any(keyword in message_lower for keyword in ['ありがとう', 'thank', 'thanks']):
        return "どういたしまして！他に何かお手伝いできることがあればお気軽にお声がけください。"

    # デフォルト応答
    return f"""ご質問ありがとうございます。

現在、カフェマップに関する以下のようなお手伝いができます：
• カフェの検索と推薦
• マップの作成と管理方法のご案内
• アプリの使い方のサポート

「{user_message}」について、もう少し具体的に教えていただけますか？"""


def create_ai_message(
    session: ChatSession,
    content: str,
    tokens_used: Optional[int] = None,
    response_time_ms: Optional[int] = None,
    model_name: Optional[str] = None
) -> ChatMessage:
    """
    AIメッセージを作成

    Args:
        session: チャットセッション
        content: メッセージ内容
        tokens_used: 使用トークン数
        response_time_ms: 応答時間
        model_name: モデル名

    Returns:
        作成されたメッセージ
    """
    message = ChatMessage.objects.create(
        session=session,
        role='assistant',
        content=content,
        tokens_used=tokens_used,
        response_time_ms=response_time_ms,
        model_name=model_name
    )

    # セッションの最終メッセージ時刻を更新
    session.last_message_at = timezone.now()
    session.save(update_fields=['last_message_at'])

    # セッションのタイトルが未設定なら、最初のユーザーメッセージから生成
    if not session.title and session.messages.count() <= 2:
        first_user_message = session.messages.filter(role='user').first()
        if first_user_message:
            session.title = first_user_message.content[:50]  # 最初の50文字
            session.save(update_fields=['title'])

    return message


def process_chat_message(session_id: int, user: User, content: str, context: Optional[Dict] = None) -> Dict:
    """
    チャットメッセージを処理してAI応答を生成

    Args:
        session_id: セッションID
        user: ユーザーオブジェクト
        content: メッセージ内容
        context: コンテキスト情報

    Returns:
        {
            "user_message": ChatMessage,
            "assistant_message": ChatMessage
        }

    Raises:
        ChatSession.DoesNotExist: セッションが見つからない
        PermissionError: セッションへのアクセス権限がない
    """
    # セッションを取得
    try:
        session = ChatSession.objects.get(id=session_id)
    except ChatSession.DoesNotExist:
        raise ChatSession.DoesNotExist(f"Session {session_id} not found")

    # 権限チェック
    if session.user != user:
        raise PermissionError(f"User {user.name} does not have access to session {session_id}")

    # コンテキストを更新（必要に応じて）
    if context:
        session.context_data = {**(session.context_data or {}), **context}
        session.save(update_fields=['context_data'])

    # ユーザーメッセージを作成
    user_message = create_user_message(session, content)

    # AI応答を生成
    ai_response = generate_ai_response(session, content)

    # AIメッセージを作成
    assistant_message = create_ai_message(
        session=session,
        content=ai_response['content'],
        tokens_used=ai_response.get('tokens_used'),
        response_time_ms=ai_response.get('response_time_ms'),
        model_name=ai_response.get('model_name')
    )

    logger.info(f"Processed message in session {session_id}: user={user_message.id}, ai={assistant_message.id}")

    return {
        "user_message": user_message,
        "assistant_message": assistant_message
    }
