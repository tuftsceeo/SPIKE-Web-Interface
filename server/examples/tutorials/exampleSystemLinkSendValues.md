## Setting Tag Values
Typically, when controlling a SPIKE remotely, we would have two webpages: the remote one, which sends values to the table based on user input, and the local page, which would run on the computer connected to the SPIKE and pull those values down from the cloud for use in a SPIKE Prime program. Let's start with the remote page.

Suppose we want to build a robot with a motor that can be controlled **remotely** with a slider. In System Link, data is stored in "tags" with assigned names and values. On our remote page, then, we'd want to have a slider that updates the value of one such tag every time the slider value is changed.

We can accomplish this using an HTML "range" input and either the `setTagValueStrict(name, value, callback)` or function `setTagValueNotStrict(name, value, callback)` of Service_SystemLink, where `name` is the name of the tag you want to change and `value` is the slider value you want to send (you can also add a callback function to run after the value is sent, but we won't be using that for now). 

But hold on, which one do we use? Why is one "strict" and the other "not strict"? In order to answer that, we're going to have to go on a little bit of a tangent.

## Strict vs Not Strict (Data Types)
In many coding languages, such as Java and C++, variables have types corresponding to what sort of data they hold, such as an integer, character, or string of text. JavaScript does not explicitly have these types- when creating a variable, you do not have to specify what type of data it is meant to hold, or even stick to the type of its initial value throughout the program. A JavaScript program will compute `0 == "0"` as `true`, regardless of one being an integer and the other a string.

However, in certain contexts, types are still an important thing to keep in mind. As previously mentioned, JavaScript considers number zero on its own equivalent to a string containing the number zero using the `==` operator (though not the `===` one). But with the `+` operator, those two zeroes will behave differently; JavaScript would compute `1 + 0` as `1`, but `1 + "0"` as `"10"`. If you were trying to, say, make a calculator in JavaScript, you'd therefore have to be mindful of which data type the program was receiving user input as, and convert it into integers accordingly.

The SystemLink database itself also recognizes these types. When you create a System Link tag and send it its initial value, it recognizes the data type of that value, and will not accept values of any other type from then on. The difference between `setTagValueStrict` and `setTagValueNotStrict` is how they adhere to this rule. If we tried to run

```javascript
serviceSystemLink.setTagValueStrict("speed", "10")
serviceSystemLink.setTagValueStrict("speed", 20)
```

the second line would throw an error, because we tried to put an integer into a tag that had previously held a string. But if we had instead used `setTagValueNotStrict`, Service_SystemLink would've performed its own conversion and run smoothly.

This might seem automatically preferable; why bother dealing with conversions on our end if we can just use non-strict mode and ignore types altogether? But think back to that calculator example; in that case, it might be nice to know for sure the type of the data we were receiving. Like the + operator, many Service_SPIKE functions, such as setting motor speeds, expect to receive numbers, and will throw errors if they get strings instead. In general, playing it too loosely with types can lead to unexpected behavior, and strict mode can help us keep things consistent.

## Creating A Tag
If you are familiar with Airtable, you are likely accustomed to the value-setting functions being smart enough to create a new tag (or entry, as they are called in Airtable) if one by the given name does not exist. However, this is not the case in SystemLink. Since we cannot guarantee that such a tag will exist upon starting the program, it's a good idea to go ahead and create all of the tags we plan to use as soon as the Service_SystemLink is initialized, using the function `createTag(tagName, tagValue, callback)`. If the tag already exists, the function is smart enough to recognize that and simply update the value instead of making a duplicate.

## The Final Product
We now have enough information to complete the remote page, which should look something like this:

```html
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/gh/tuftsceeo/SPIKE-Web-Interface@1.0/cdn/ServiceDock.min.js"></script>
    </head>
    <body>
         <div id = "servicedock" style = "float:right;">
            <service-systemlink id = "service_systemlink"></service-systemlink>
        </div>
        <label for="speed_slider">Motor Speed (-100 to 100): </label>
        <input type="range" id="speed_slider" onchange="sendMotorSpeed(this.value)" min="-100" max="100">
    </body>
    <script>
        var elementServiceSystemLink = document.getElementById("service_SystemLink")
        elementServiceSystemLink.setAttribute("apikey", "your_API_key")
        elementServiceSystemLink.init()

        var serviceSystemLink = elementServiceSystemLink.getService()

        // creating motor_speed tag
        serviceSystemLink.executeAfterInit(function() { serviceSystemLink.createTag("motor_speed", 0) })

        /* sets value of motor_speed tag to given speed
         * NOTE: assumes motor_speed tag exists
         */
        function sendMotorSpeed(speed) {
            serviceSystemLink.setTagValueStrict("motor_speed", parseInt(speed)) 
            // here, speed is actually coming in as a string, which would be a problem when trying to send it into a motor, hence the use of the built-in JavaScript function "parseInt" to convert it into an integer
        }
    </script>
</html>
```

The example below is that same remote page, but with the SystemLink uninitialized. If you input your own API Key by clicking the SystemLink icon, you should be able to see the motor_speed value change in your own database with each move of the slider.

<iframe id="remote-example-result" width="100%" height="450" frameborder="0" src="servicedock_systemLinkSimpleRemote.html"></iframe>