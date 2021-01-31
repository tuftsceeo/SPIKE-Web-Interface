var testGetTagsInfo = document.getElementById("testGetTagsInfo_AT");
var testSetTagValue = document.getElementById("testSetTagValue_AT");
var testSetTagValueNonString = document.getElementById("testSetTagValueNonString_AT")
var testGetTagValue = document.getElementById("testGetTagValue_AT");
var testCreateTag = document.getElementById("testCreateTag_AT");
var testDeleteTag = document.getElementById("testDeleteTag_AT");
var testIsActive = document.getElementById("testIsActive_AT");
var testSetTagValueNoCB_AT = document.getElementById("testSetTagValueNoCB_AT");
var testSetStringTagValueWithNumber_AT = document.getElementById("testSetStringTagValueWithNumber_AT");
var testSetStringTagValueWithBoolean_AT = document.getElementById("testSetStringTagValueWithBoolean_AT");
var testSetIntTagValueWithStringThatIsNumber_AT = document.getElementById("testSetIntTagValueWithStringThatIsNumber_AT");
var testSetStringTagValueWithStringThatIsNumber_AT = document.getElementById("testSetStringTagValueWithStringThatIsNumber_AT");

testGetTagsInfo.addEventListener("click", function () {
    console.log("##### BEGINNING TEST getEntriesInfo() AIRTABLE #####");
    let entriesInfo = Airtable.getEntriesInfo();
    console.log("entriesInfo: ", entriesInfo);
    console.log("##### ENDING TEST getEntriesInfo() AIRTABLE #####");
})

testSetTagValue.addEventListener("click", function () {
    console.log("##### BEGINNING TEST.setEntryValueNotStrict() AIRTABLE #####");
    console.log("Setting the value of 'command' to 'testing string input' ");
    Airtable.setEntryValueNotStrict("command", "default", function () {
        console.log("command value: ", Airtable.getEntryValue("command"));
        Airtable.setEntryValueNotStrict("command", "testing string input", function () {
            console.log("new command value: ", Airtable.getEntryValue("command"));
            console.log("##### ENDING TEST.setEntryValueNotStrict() AIRTABLE #####");
        })
    })
})

testSetTagValueNonString.addEventListener("click", function () {
    console.log("##### BEGINNING TEST.setEntryValueNotStrict() of non string in AIRTABLE #####");
    console.log("Setting the value of 'command' to 123 ")
    Airtable.setEntryValueNotStrict("command", 123, function () {
        let entriesInfo = Airtable.getEntriesInfo();
        console.log("entriesInfo: ", entriesInfo);
        console.log("##### ENDING TEST.setEntryValueNotStrict() of non string in AIRTABLE #####");
    })
})

testGetTagValue.addEventListener("click", function () {
    console.log("##### BEGINNING TEST getEntryValue() AIRTABLE #####");
    console.log("Getting value of 'command' tag ")
    let value = Airtable.getEntryValue("command");

    console.log("value: ", value);

    console.log("##### ENDING TEST getEntryValue() AIRTABLE #####");
})

testCreateTag.addEventListener("click", function () {
    console.log("##### BEGINNING TEST createEntry() AIRTABLE #####");
    console.log("Creating tag called 'newTag' ")
    // create a tag called "newTag"
    Airtable.createEntry("newTag", "new value", function () {
        let entriesInfo = Airtable.getEntriesInfo();
        console.log("entriesInfo: ", entriesInfo);
        console.log("##### ENDING TEST createEntry() AIRTABLE #####");
    })

})

testDeleteTag.addEventListener("click", function () {
    console.log("##### BEGINNING TEST deleteEntry() AIRTABLE #####");
    console.log("Deleting tag called 'newTag' ")
    Airtable.deleteEntry("newTag", function () {
        let entriesInfo = Airtable.getEntriesInfo();
        console.log("entriesInfo:", entriesInfo);
        console.log("##### ENDING TEST deleteEntry() AIRTABLE #####");
    })
})

testIsActive.addEventListener("click", function () {
    console.log("##### BEGINNING TEST isActive() AIRTABLE #####");

    console.log("##### ENDING TEST isActive() AIRTABLE #####");
})

testSetTagValueNoCB_AT.addEventListener("click", function () {
    console.log("##### BEGINNING TEST.setEntryValueNotStrict() without callback AIRTABLE #####");

    Airtable.setEntryValueNotStrict("message", 100);

    console.log("##### ENDING TEST.setEntryValueNotStrict() without callback AIRTABLE #####");
})

testSetStringTagValueWithNumber_AT.addEventListener("click", function () {
    console.log("##### BEGINNING TEST.setEntryValueNotStrict() of string tag with number AIRTABLE #####");
    
    Airtable.setEntryValueNotStrict("message", "default", function () {
        console.log("message value: ", Airtable.getEntryValue("message"));
        console.log("changing value");
        Airtable.setEntryValueNotStrict("message", 123, function () {
            console.log("new message value: ", Airtable.getEntryValue("message"));
            console.log("##### ENDING TEST.setEntryValueNotStrict() of string tag with number AIRTABLE #####");
        })
    });

})

testSetStringTagValueWithBoolean_AT.addEventListener("click", function () {
    console.log("##### BEGINNING TEST.setEntryValueNotStrict() of string tag with boolean AIRTABLE #####");

    Airtable.setEntryValueNotStrict("message", "default", function () {
        console.log("message value: ", Airtable.getEntryValue("message"));
        console.log("changing value");
        Airtable.setEntryValueNotStrict("message", true, function () {
            console.log("new message value: ", Airtable.getEntryValue("message"));
            console.log("##### ENDING TEST.setEntryValueNotStrict() of string tag with boolean AIRTABLE #####");
        })
    });

})

testSetIntTagValueWithStringThatIsNumber_AT.addEventListener("click", function () {
    console.log("##### BEGINNING TEST.setEntryValueNotStrict() of integer tag with string that is a number AIRTABLE #####");

    Airtable.setEntryValueNotStrict("integer", 1234, function () {
        console.log("integer value: ", Airtable.getEntryValue("integer"));
        console.log("changing value");
        Airtable.setEntryValueNotStrict("integer", "123", function () {
            console.log("new integer value: ", Airtable.getEntryValue("integer"));
            console.log("##### ENDING TEST.setEntryValueNotStrict() of integer tag with string that is a number AIRTABLE #####");
        })
    });

})

testSetStringTagValueWithStringThatIsNumber_AT.addEventListener("click", function () {
    console.log("##### BEGINNING TEST.setEntryValueNotStrict() of string tag with string that is a number AIRTABLE #####");

    Airtable.setEntryValueNotStrict("message", "default", function () {
        console.log("message value: ", Airtable.getEntryValue("message"));
        console.log("changing value");
        Airtable.setEntryValueNotStrict("message", "123", function () {
            console.log("new message value: ", Airtable.getEntryValue("message"));
            console.log("##### ENDING TEST.setEntryValueNotStrict() of string tag with string that is a number AIRTABLE #####");
        })
    });

})