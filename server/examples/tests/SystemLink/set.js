var setTagValue = document.getElementById("setTagValue");
setTagValue.addEventListener("click", async function () {
    console.log("creating 'newTag' with value 4 ");

    // create 'newTag'
    mySL.createTag("newTag", 4, async function () {

        console.log("'newTag' was created")

        await sleep(2000);

        console.log(await mySL.getTagsInfo());

        //set tag value to 5
        mySL.setTagValue("newTag", 5);
        console.log("'newTag' value was changed to 5. run tagsinfo to check");
    });
})

var setINTtagwithString = document.getElementById("setINTtagwithString");
setINTtagwithString.addEventListener("click", function () {
    console.log("changing an INT data type tag's value with string input");

    mySL.setTagValue("integer1", "1");
    console.log("check integer1");
})

var setINTtagwithNumber = document.getElementById("setINTtagwithNumber");
setINTtagwithNumber.addEventListener("click", function () {
    console.log("changing an INT data type tag's value with number input");

    mySL.setTagValue("integer1", 1);

    console.log("check integer1");
})

var setSTRINGtagwithNumber = document.getElementById("setSTRINGtagwithNumber");
setSTRINGtagwithNumber.addEventListener("click", function () {
    console.log("changing an STRING data type tag's value with number input");
    mySL.setTagValue("message", 1);
    console.log("check message");
})

var setSTRINGtagwithString = document.getElementById("setSTRINGtagwithString");
setSTRINGtagwithString.addEventListener("click", function () {
    console.log("changing an STRING data type tag's value with string input");
    mySL.setTagValue("message", "hi");
    console.log("check message");
})

var setBOOLEANtagwithString = document.getElementById("setBOOLEANtagwithString");
setBOOLEANtagwithString.addEventListener("click", function () {
    console.log("changing a BOOLEAN data type tag's value with string input");
    mySL.setTagValue("abool", "true");
    console.log("check abool");
})

var setINTtagwithBool = document.getElementById("setINTtagwithBool");
setINTtagwithBool.addEventListener("click", function () {
    console.log("changing an int data type tag's value with string input");
    let tagsInfo = mySL.getTagsInfo();
    console.log(tagsInfo);
    mySL.setTagValue("integer1", true, function () {
        console.log("check integer1");
        let tagsInfo = mySL.getTagsInfo();
        console.log(tagsInfo);
    })
})

var setBOOLEANtagWithBoolean = document.getElementById("setBOOLEANtagWithBoolean");
setBOOLEANtagWithBoolean.addEventListener("click", function () {
    console.log("changing a BOOLEAN data type tag's value with boolean input");
    mySL.setTagValue("abool", false, function () {
        console.log("check abool");
        let tagsInfo = mySL.getTagsInfo();
        console.log(tagsInfo);
    });
})