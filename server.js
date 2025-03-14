const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (ws) => {
  console.log("✅ クライアントが接続しました");
  console.log(`🌐 現在の接続数: ${server.clients.size}`);

  ws.on("message", (message) => {
    // WebSocketのメッセージはBuffer型の場合があるため、文字列に変換
    const messageString = message.toString();

    console.log(`📩 受信: ${messageString}`);

    // メッセージの先頭に "(me)" がついていたら取り除く
    const cleanMessage = messageString.replace(/^\(me\)/, "");

    // 受信したメッセージを全てのクライアントに送信（自分には送らない）
    server.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log("送信中: ", cleanMessage); // 送信するメッセージを確認
        client.send(cleanMessage); // プレフィックスなしでメッセージ送信
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ クライアントが切断されました");
    console.log(`🌐 現在の接続数: ${server.clients.size}`);
  });
});

console.log("🚀 WebSocketサーバーが ws://localhost:8080 で起動中");
