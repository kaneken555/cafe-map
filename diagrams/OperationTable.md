| Operation                           | 更新 state                                  | 所有者      | 副作用                              |
|-------------------------------------|---------------------------------------------|-------------|-------------------------------------|
| マップを選択                        | selectedMap, (必要なら) mapMode='default'   | map slice   | 関連クエリが自動切替（依存Query）   |
| キーワード検索実行                  | （UIローカル）keyword                       | local/UI    | GET /cafes/search → Queryが所有     |
| 検索結果からカフェ選択              | selectedSearchedCafe                         | cafe slice  | なし                                |
| MyCafeリストからカフェ選択          | selectedRegisteredCafe                       | cafe slice  | なし                                |
| カフェをマップに追加(確定)          | （Queryが所有）myCafeList                    | Query       | POST /maps/:id/cafes + invalidate   |
| シェアマップを開く                  | selectedMap, mapMode='shared'               | map slice   | GET /shared-maps/:uuid（Query）     |
| モーダル開/閉 (各種)                | isXxxModalOpen                               | local/UI or ui slice | なし                     |
| ログイン成功                        | user                                         | auth slice  | 初期データprefetch(複数Query)       |
| ログアウト                          | user=null、各slice reset                     | auth/map/cafe/ui | Query cache clear             |
