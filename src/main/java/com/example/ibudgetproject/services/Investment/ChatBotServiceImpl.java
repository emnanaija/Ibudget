package com.example.ibudgetproject.services.Investment;


import com.example.ibudgetproject.Response.ChatbotInvestApiResponse;
import com.example.ibudgetproject.Response.FunctionResponse;
import com.example.ibudgetproject.entities.Investment.CoinDTO;
import jakarta.persistence.criteria.CriteriaBuilder;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;

import javax.print.attribute.standard.JobStateReasons;
import java.util.Map;


@Service
public class ChatBotServiceImpl implements ChatbotService {

    String GEMINI_API_KEY = "AIzaSyDn6MKhbD9XVxGy1IG7xcGOGGKN7yDbpW4";

    public double convertToDouble(Object value) {
        if (value instanceof Integer) {
            return ((Integer) value).doubleValue();
        }
        if (value instanceof Long) {
            return ((Long) value).doubleValue();
        }
        if (value instanceof Double) {
            return ((Double) value).doubleValue();
        } else throw new IllegalArgumentException("unsupported type" + value.getClass().getName());
    }
    @Retryable(value = Exception.class, maxAttempts = 3)
    public CoinDTO makeApiRequest(String currencyName) throws Exception {

        String url = "https://api.coingecko.com/api/v3/coins/bitcoin" ;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> responseEntity = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> responseBody = responseEntity.getBody();

        if (responseBody != null) {
            Map<String, Object> image = (Map<String, Object>) responseBody.get("image");
            Map<String, Object> marketData = (Map<String, Object>) responseBody.get("market_data");

            CoinDTO coinDTO = new CoinDTO();
            coinDTO.setId((String) responseBody.get("id"));
            coinDTO.setName((String) responseBody.get("name"));
            coinDTO.setSymbol((String) responseBody.get("symbol"));
            coinDTO.setImage((String) responseBody.get("large"));
            //   bech nzidou el data mtaa el market

            coinDTO.setCurrentPrice(convertToDouble(((Map<String, Object>) marketData.get("current_price")).get("usd")));
            coinDTO.setMarketCap(convertToDouble(((Map<String, Object>) marketData.get("market_cap")).get("usd")));
            coinDTO.setMarketCapRank(convertToDouble(((int) marketData.get("market_cap_rank"))));
            coinDTO.setTotalVolume(convertToDouble(((Map<String, Object>) marketData.get("total_volume")).get("usd")));
            coinDTO.setHigh24h(convertToDouble(((Map<String, Object>) marketData.get("high_24h")).get("usd")));
            coinDTO.setLow24h(convertToDouble(((Map<String, Object>) marketData.get("low_24h")).get("usd")));
            coinDTO.setPriceChange24h(convertToDouble((marketData.get("price_change_24h"))));

            coinDTO.setPriceChangePercentage24h(convertToDouble((marketData.get("price_change_percentage_24h"))
            ));
            coinDTO.setMarketCapChange24h(convertToDouble((marketData.get("market_cap_change_24h"))
            ));
            coinDTO.setMarketCapChangePercentage24h(convertToDouble((marketData.get("market_cap_change_percentage_24h"))
            ));
            coinDTO.setCirculatingSupply(convertToDouble((marketData.get("circulating_supply"))
            ));
            coinDTO.setTotalSupply(convertToDouble((marketData.get("total_supply"))
            ));
            return coinDTO;
        }

        throw new Exception("coin not found");

    }


    public FunctionResponse getFunctionResponse(String prompt) {
        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + GEMINI_API_KEY;
        JSONObject requestBodyJson = new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", prompt)
                                        )
                                )
                        )
                )
                .put("tools", new JSONArray()
                        .put(new JSONObject()
                                .put("functionDeclarations", new JSONArray()
                                        .put(new JSONObject()
                                                .put("name", "getCoinDetails")
                                                .put("description", "Get the coin details from given currency object")
                                                .put("parameters", new JSONObject()
                                                        .put("type", "OBJECT")
                                                        .put("properties", new JSONObject()
                                                                .put("currencyName", new JSONObject()
                                                                        .put("type", "STRING")
                                                                        .put(
                                                                                "description",
                                                                                "The currency name, " +
                                                                                        "id,symbol.")
                                                                )
                                                                .put("currencyData", new JSONObject()
                                                                        .put("type", "STRING")
                                                                        .put("description",
                                                                                "Currency Data id, " +
                                                                                        "symbol, " +
                                                                                        "name, " +
                                                                                        "image, " +
                                                                                        "current_price, " +
                                                                                        "market_cap, " +
                                                                                        "market_cap_rank, " +
                                                                                        "fully_diluted_valuation, " +
                                                                                        "total_volume, " +
                                                                                        "high_24h, " +
                                                                                        "low_24h, " +
                                                                                        "price_change_24h, " +
                                                                                        "price_change_percentage_24h, " +
                                                                                        "market_cap_change_24h, " +
                                                                                        "market_cap_change_percentage_24h, " +
                                                                                        "circulating_supply, " +
                                                                                        "total_supply, " +
                                                                                        "max_supply, " +
                                                                                        "ath, " +
                                                                                        "ath_change_percentage, " +
                                                                                        "ath_date, " +
                                                                                        "atl, " +
                                                                                        "atl_change_percentage, " +
                                                                                        "atl_date, last_updated.")
                                                                )
                                                        )
                                                        .put("required", new JSONArray()
                                                                .put("currencyName")
                                                                .put("currencyData")
                                                        )
                                                )
                                        )
                                )
                        )
                );
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBodyJson.toString(), headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, requestEntity, String.class);

        String responseBody = response.getBody();

        JSONObject jsonObject = new JSONObject(responseBody);

        JSONArray candidates= jsonObject.getJSONArray("candidates");
        JSONObject firstCandidate= candidates.getJSONObject(0);

        JSONObject content= firstCandidate.getJSONObject("content");
        JSONArray parts= content.getJSONArray("parts");
        JSONObject firstPart= parts.getJSONObject(0);
        JSONObject functionCall= firstPart.getJSONObject("functionCall");

        String functionName=functionCall.getString("name");
        JSONObject args= functionCall.getJSONObject("args");
        String currencyName= args.getString("currencyName");
        String currencyData= args.getString("currencyData");

        System.out.println("Function Name:" + functionName);
        System.out.println("Currency Name:" + currencyName);
        System.out.println("Currency Data:" + currencyData);

        FunctionResponse res=new FunctionResponse();
        res.setFunctionName(functionName);
        res.setCurrencyData(currencyData);
        res.setCurrencyName(currencyName);
        return res;
    }



    @Override
    public ChatbotInvestApiResponse getCoinDetails(String prompt) throws Exception {
        CoinDTO coinDTO = makeApiRequest(prompt);
        FunctionResponse res = getFunctionResponse(prompt);


        String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + GEMINI_API_KEY;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = new JSONObject()
                .put("contents", new JSONArray()
                        .put(new JSONObject()
                                .put("role", "user")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("text", prompt)
                                        )
                                )
                        )
                        .put(new JSONObject()
                                .put("role", "model")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("functionCall", new JSONObject()
                                                        .put("name", "getCoinDetails")
                                                        .put("args", new JSONObject()
                                                                .put("currencyName", res.getCurrencyName())
                                                                .put("currencyData", res.getCurrencyData())
                                                        )
                                                )
                                        )
                                )
                        )
                        .put(new JSONObject()
                                .put("role", "function")
                                .put("parts", new JSONArray()
                                        .put(new JSONObject()
                                                .put("functionResponse", new JSONObject()
                                                        .put("name", "getCoinDetails")
                                                        .put("response", new JSONObject()
                                                                .put("content", new JSONObject(coinDTO))
                                                        )
                                                )
                                        )
                                )
                        )
                )
                .put("tools", new JSONArray()
                        .put(new JSONObject()
                                .put("functionDeclarations", new JSONArray()
                                        .put(new JSONObject()
                                                .put("name", "getCoinDetails")
                                                .put("description", "Get the coin details from given currency object")
                                                .put("parameters", new JSONObject()
                                                        .put("type", "OBJECT")
                                                        .put("properties", new JSONObject()
                                                                .put("currencyName", new JSONObject()
                                                                        .put("type", "STRING")
                                                                        .put("description",
                                                                                "The currency Name"
                                                                                        + "id, "+
                                                                                        "symbol.")
                                                                )
                                                                .put("currencyData", new JSONObject()
                                                                        .put("type", "STRING")
                                                                        .put("description",
                                                                                "The currency data id, "
                                                                                        +"symbol, "
                                                                                        +"current price, "
                                                                                        + "image, "
                                                                                        + "market cap extra....")
                                                                )
                                                        )
                                                        .put("required", new JSONArray()
                                                                .put("currencyName")
                                                                .put("currencyData")
                                                        )
                                                )
                                        )
                                )
                        )
                )
                .toString();

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, request, String.class);

        String responseBody = response.getBody();


        System.out.println("----------" + responseBody);
        JSONObject jsonObject = new JSONObject(responseBody);

        JSONArray candidates= jsonObject.getJSONArray("candidates");
        JSONObject firstCandidate= candidates.getJSONObject(0);

        JSONObject content= firstCandidate.getJSONObject("content");
        JSONArray parts= content.getJSONArray("parts");
        JSONObject firstPart= parts.getJSONObject(0);
        String text= firstPart.getString("text");

        ChatbotInvestApiResponse resp=new ChatbotInvestApiResponse();

        resp.setMessage(text);

        return resp;
    }

    @Override
    public String simpleChat(String prompt) {
        String GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+GEMINI_API_KEY;

        HttpHeaders headers=new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody= new JSONObject()
                .put("contents",new JSONArray()
                        .put(new JSONObject()
                                .put("parts",new JSONArray()
                                        .put(new JSONObject()
                                                .put("text",prompt))))

                ).toString();

        HttpEntity<String> requestEntity=new HttpEntity<>(requestBody,headers);

        RestTemplate restTemplate= new RestTemplate();

        ResponseEntity<String> response=restTemplate.postForEntity(GEMINI_API_URL,requestEntity, String.class);
        return response.getBody();
    }
}

