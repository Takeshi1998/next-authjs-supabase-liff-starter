#!/bin/bash

# カラー設定
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== LINE LIFF アプリケーション用 HTTPS 環境セットアップ ===${NC}"
echo ""

# mkcertがインストールされているか確認
if ! command -v mkcert &> /dev/null; then
    echo -e "${RED}mkcertがインストールされていません。${NC}"
    echo -e "${YELLOW}以下の手順でmkcertをインストールしてください:${NC}"
    echo ""
    echo "macOSの場合:"
    echo "  brew install mkcert"
    echo "  brew install nss # Firefoxを使用する場合"
    echo ""
    echo "Linuxの場合:"
    echo "  sudo apt install libnss3-tools"
    echo "  curl -JLO \"https://dl.filippo.io/mkcert/latest?for=linux/amd64\""
    echo "  chmod +x mkcert-v*-linux-amd64"
    echo "  sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert"
    echo ""
    echo "Windowsの場合:"
    echo "  choco install mkcert"
    echo ""
    echo -e "${YELLOW}mkcertをインストール後、このスクリプトを再実行してください。${NC}"
    exit 1
fi

echo -e "${GREEN}mkcertがインストールされています。証明書の生成を開始します...${NC}"
echo ""

# ローカルCAのインストール
echo "ローカルCAをインストールしています..."
mkcert -install

# 証明書用のディレクトリを作成
echo "証明書用のディレクトリを作成しています..."
mkdir -p certificates

# localhost用の証明書を生成
echo "localhost用の証明書を生成しています..."
mkcert -key-file ./certificates/localhost-key.pem -cert-file ./certificates/localhost.pem localhost 127.0.0.1 ::1

# 証明書が正常に生成されたか確認
if [ -f "./certificates/localhost.pem" ] && [ -f "./certificates/localhost-key.pem" ]; then
    echo ""
    echo -e "${GREEN}証明書が正常に生成されました！${NC}"
    echo ""
    echo -e "証明書の場所:"
    echo -e "  - 証明書: ${YELLOW}./certificates/localhost.pem${NC}"
    echo -e "  - 秘密鍵: ${YELLOW}./certificates/localhost-key.pem${NC}"
    echo ""
    echo -e "${GREEN}Next.jsアプリケーションをHTTPSで実行するには:${NC}"
    echo -e "  1. .envファイルの${YELLOW}NEXTAUTH_URL${NC}を${YELLOW}https://localhost:3000${NC}に設定してください"
    echo -e "  2. LIFFアプリのエンドポイントURLを${YELLOW}https://localhost:3000${NC}に設定してください"
    echo -e "  3. ${YELLOW}pnpm dev${NC}コマンドでアプリケーションを起動してください"
    echo ""
    echo -e "${YELLOW}注意: ブラウザで証明書の警告が表示される場合がありますが、開発環境では問題ありません。${NC}"
else
    echo -e "${RED}証明書の生成中にエラーが発生しました。${NC}"
    exit 1
fi