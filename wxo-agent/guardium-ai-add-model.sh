orchestrate connections remove -a watsonx-cine

orchestrate connections import -f wxai-connection-token.yaml

# orchestrate connections add -a watsonx-cine
# orchestrate connections configure -a watsonx-cine --env live -k bearer -t team

orchestrate connections set-credentials -a watsonx-cine \
  --env live \
  --token ${BEARER_TOKEN}

orchestrate connections set-credentials -a watsonx-cine \
  --env draft \
  --token ${BEARER_TOKEN}

orchestrate models import --file guardium-ai-watonx.yaml --app-id watsonx-cine

orchestrate models list

# Pegar o token via IBM Cloud CLI

#curl -X POST "https://iam.cloud.ibm.com/identity/token" \
#-H "Content-Type: application/x-www-form-urlencoded" \
#-d "apikey=mVBOT7xOfc_BYN343cQ0Fgi7JpvxAH7nNXp9_ncDUMuE&grant_type=urn:ibm:params:oauth:grant-type:apikey"

