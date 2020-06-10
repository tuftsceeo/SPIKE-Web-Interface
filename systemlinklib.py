import requests, json

class SLObject:
    def __init__(self, APIkey):
        self.APIkey = APIkey
        self.headers = {"Accept":"application/json","x-ni-api-key":APIkey}
        self.urlBase = "https://api.systemlinkcloud.com"
        self.auth_key(APIkey)
    
    def auth_key(self, APIkey):
        urlValue = self.urlBase + "/niauth/v1" + "/auth"
        response = requests.get(urlValue, headers = self.headers).text
        data = json.loads(response)
        self.check_error(data)
        result = data

        return result

    def get_tag_value(self, Tag):
        urlValue = self.urlBase + "/nitag/v2/tags/" + Tag + "/values/current"
        response = requests.get(urlValue, headers = self.headers).text
        data = json.loads(response)
        self.check_error(data)
        result = data.get("value").get("value")

        return result

    def update_tag_value(self, Tag, Type, Value):
        urlValue = self.urlBase + "/nitag/v2/tags/" + Tag + "/values/current"
        propValue = {"value":{"type":Type,"value":Value}}
        try:
            response = requests.put(urlValue,headers=headers,json=propValue).text
        except Exception as e:
            print(e)
            response = 'failed'
        return response

    def check_error(self, response):
        error_dict = data.get("error")
        print(error_dict)
        if error_dict:
            print("Okay?")
            error = error_dict.get("name")
            if error == "Unauthorized":
                raise RuntimeError('API Key is missing or invalid')
            elif error == "Tag.NoSuchTag":
                raise RuntimeError(error_dict.get("message"))

    