"""
Project Name: SystemLink python library
File name: systemlinklib.py
Author: Jeremy Jung
Date: 6/10/20
Description: Python API to access and modify SystemLink cloud data using json and http requests
Credits/inspirations: Based on code wrriten by Chris Rogers, Ethan Danahy, 2020
History: 
    Created by Jeremy on 6/10/20
License: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
"""
import requests, json

class SLObject:

    # Manually accessing cloud (when using it first time):
    # 1. Go to https://www.systemlinkcloud.com/
    # 2. Sign up with a NI account.
    # 3. Verify via the serial number: 
    # 4. Make APIkey

    # EXAMPLE USE:
    # import systemlinklib as SystemLink
    # SLobj = SystemLink.SLObject("APIkey = xxxxxxxxxx") #initialize
    # SLobj.update_tag_value(self, "name", "Type", Value) #change the current value of tag
    # print(SLobj.get_tag_value(Tag = "tag")) #confirm the change

    # TODO
    # make a function listing all possible tag Types. 
    # broaden check_error()
    # more functions
    #test create_tag

    #APIkey = string
    def __init__(self, APIkey):
        self.APIkey = APIkey
        #required header for all requests
        self.headers = {"Accept":"application/json","x-ni-api-key":APIkey}
        #main url for cloud
        self.urlBase = "https://api.systemlinkcloud.com"
        #check APIkey
        self.auth_key(APIkey)
    
    #check API key validity during inititialization
    def auth_key(self, APIkey):
        #url for auth service
        urlValue = self.urlBase + "/niauth/v1" + "/auth"
        response = requests.get(urlValue, headers = self.headers).text
        data = json.loads(response)
        #check for errors
        self.check_error(data)
        result = data

        return result

    #Parameters: Tag = string
    #get current value of a tag
    def get_tag_value(self, Tag):
        urlValue = self.urlBase + "/nitag/v2/tags/" + Tag + "/values/current"
        response = requests.get(urlValue, headers = self.headers).text
        data = json.loads(response)
        #check for errors
        self.check_error(data)
        result = data.get("value").get("value")

        return result

    #not tested (NOTE: key_value_dict type could be a dictionary, collectAgg might always be true)
    #create or replace a tag
    def create_tag(self, Tag, Type, Value, collectAgg, key_value_dict):
        urlValue = self.urlBase + "/nitag/v2/tags/" + Tag
        propValue = { "type": Type, "properties": { "key1": "value1", "key2": "value2" }, "path": Tag, "keywords": 
        [ "fooKeyword", "barKeyword" ], "collectAggregates": true }
        try:
            response = requests.put(urlValue,headers=headers,json=propValue).text
        except Exception as e:
            raise Exception(e)

        return response
    
    #Input: Tag = string, Type = string, Value = string
    #update current value of a tag
    def update_tag_value(self, Tag, Type, Value):
        urlValue = self.urlBase + "/nitag/v2/tags/" + Tag + "/values/current"
        propValue = {"value":
            {"type":Type,"value":Value}
        }
        try:
            response = requests.put(urlValue,headers=headers,json=propValue).text
        except Exception as e:
            print(e)
            response = 'failed'
        return response

    # throw error details from SystemLink HTTP responses
    def check_error(self, response):
        error_dict = data.get("error")
        print(error_dict)
        if error_dict:
            error = error_dict.get("name")
            if error == "Unauthorized":
                raise RuntimeError('API Key is missing or invalid')
            elif error == "Tag.NoSuchTag":
                raise RuntimeError(error_dict.get("message"))
            raise RuntimeError("derp")

    