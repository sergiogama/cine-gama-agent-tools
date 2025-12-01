#!/usr/bin/env bash
set -euo pipefail

# Pequeno helper para commitar e publicar rapidamente no GitHub.
# Uso:
#   ./update-github.sh                       # commit automático com timestamp
#   ./update-github.sh -m "feat: nova versão"
#   ./update-github.sh -m "release v1.2" -t v1.2.0

COMMIT_MSG=""
TAG_NAME=""
BRANCH_NAME="${BRANCH_NAME:-main}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--message)
      COMMIT_MSG="${2:-}"
      shift 2
      ;;
    -t|--tag)
      TAG_NAME="${2:-}"
      shift 2
      ;;
    -h|--help)
      echo "Uso: $0 [-m|--message \"mensagem\"] [-t|--tag vX.Y.Z]"
      exit 0
      ;;
    *)
      echo "Parâmetro não reconhecido: $1"
      exit 1
      ;;
  esac
done

if [[ -z "$COMMIT_MSG" ]]; then
  read -rp "Deseja informar uma mensagem de commit? [s/N]: " WANT_MSG
  if [[ "$WANT_MSG" =~ ^[sS](im)?$ ]]; then
    read -rp "Mensagem de commit: " COMMIT_MSG
  fi
fi

COMMIT_MSG=${COMMIT_MSG:-"chore: update $(date +'%Y-%m-%d %H:%M')"}

if [[ -z "$TAG_NAME" ]]; then
  read -rp "Deseja criar/enviar uma tag? [s/N]: " WANT_TAG
  if [[ "$WANT_TAG" =~ ^[sS](im)?$ ]]; then
    read -rp "Informe o nome da tag (ex: v1.2.0): " TAG_NAME
  fi
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo "-> Atualizando branch local ($BRANCH_NAME)..."
git fetch origin
git checkout "$BRANCH_NAME"
if ! git pull --rebase --autostash origin "$BRANCH_NAME"; then
  echo "Falha ao atualizar. Verifique conflitos ou alterações locais e tente novamente."
  exit 1
fi

echo "-> Adicionando mudanças..."
git add .

if git diff --cached --quiet; then
  echo "Nada para commitar."
  exit 0
fi

echo "-> Commitando: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

if [[ -n "$TAG_NAME" ]]; then
  echo "-> Criando/atualizando tag: $TAG_NAME"
  git tag -f "$TAG_NAME"
fi

echo "-> Fazendo push para origin/$BRANCH_NAME..."
git push origin "$BRANCH_NAME"

if [[ -n "$TAG_NAME" ]]; then
  echo "-> Enviando tag $TAG_NAME..."
  git push -f origin "$TAG_NAME"
fi

echo "Concluído."
