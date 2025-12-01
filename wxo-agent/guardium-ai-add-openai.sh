#!/usr/bin/env bash
set -euo pipefail

APP_ID="${APP_ID:-openai-gpt-5}"
MODEL_NAME="${MODEL_NAME:-virtual-model/openai/gpt-5-2025-08-07}"
ORCHESTRATE_ENV_NAME="${ORCHESTRATE_ENV_NAME:-cinema_env}"
ORCHESTRATE_ENV_ID="${ORCHESTRATE_ENV_ID:-}"
OPENAI_API_KEY="${OPENAI_API_KEY:-}"
CUSTOM_HOST="${CUSTOM_HOST:-https://node-red.sergiogama.com}"
ENDPOINT_IDENTIFIER="${ENDPOINT_IDENTIFIER:-IBM_Enablement OpenAI}"

if [[ -z "$ORCHESTRATE_ENV_ID" ]]; then
  echo "Defina ORCHESTRATE_ENV_ID com o id do ambiente (obrigatório)." >&2
  exit 1
fi

if [[ -z "$OPENAI_API_KEY" ]]; then
  echo "Defina OPENAI_API_KEY antes de rodar este script." >&2
  exit 1
fi

orchestrate env activate -a "$ORCHESTRATE_ENV_ID" "$ORCHESTRATE_ENV_NAME"

orchestrate models remove -n "$MODEL_NAME" || true
orchestrate connections remove -a "$APP_ID" || true

orchestrate connections import -f openai-connection-apikey.yaml

orchestrate connections configure -a "$APP_ID" --env live -k key_value -t team
orchestrate connections configure -a "$APP_ID" --env draft -k key_value -t team

orchestrate connections set-credentials -a "$APP_ID" --env live -e "api_key=${OPENAI_API_KEY}"
orchestrate connections set-credentials -a "$APP_ID" --env draft -e "api_key=${OPENAI_API_KEY}"

orchestrate models add \
  --name "$MODEL_NAME" \
  --app-id "$APP_ID" \
  --description "GPT-5 is our flagship model for coding, reasoning, and agentic tasks across domains. Learn more in our GPT-5 usage guide." \
  --display-name "IBM Guardium AI Gateway GPT 5" \
  --type chat \
  --provider-config "{
    \"custom_host\": \"${CUSTOM_HOST}\",
    \"api_key\": \"${OPENAI_API_KEY}\",
    \"response_headers\": [\"Content-Type:application/json\", \"Authorization:Bearer ${OPENAI_API_KEY}\", \"x-alltrue-llm-endpoint-identifier:${ENDPOINT_IDENTIFIER}\"]
  }"

orchestrate models list

# Pegar o token via IBM Cloud CLI

#curl -X POST "https://iam.cloud.ibm.com/identity/token" \
#-H "Content-Type: application/x-www-form-urlencoded" \
#-d "apikey=mVBOT7xOfc_BYN343cQ0Fgi7JpvxAH7nNXp9_ncDUMuE&grant_type=urn:ibm:params:oauth:grant-type:apikey"

