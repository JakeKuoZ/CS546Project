const btnImageRemove = document.getElementById("btnImageRemove")
const btnVideoRemove = document.getElementById("btnVideoRemove")
const crrImageName = document.getElementById("crrImageName")
const crrVideoName = document.getElementById("crrVideoName")
const imageViewer = document.getElementById("imageViewer")
const videoViewer = document.getElementById("videoViewer")

btnImageRemove.addEventListener("click", (event) => {
    crrImageName.value = ""
    imageViewer.classList.add("d-none")
})

btnVideoRemove.addEventListener("click", (event) => {
    crrVideoName.value = ""
    videoViewer.classList.add("d-none")
})

let btnDelete = document.getElementById("btnDelete")
    function myTest() {
        $.ajax({
            url: "/service/alter-service/{{serviceId}}",
            type: "DELETE",
            contentType:'application/json',
            dataType: 'text',
            success: function(result, status, error) {
                window.location.href = "/service";
            },
            error: function(result, status, error) {
                showError(result.responseText)
            }
        })
    }
    
    function showError(responseObjString) {
        const responseObj = JSON.parse(responseObjString)
        const errors = JSON.parse(responseObj.errors)
        const divOtherErrorArea = document.getElementById("otherErrorArea")
        if(errors.otherErrors !== undefined) {
            divOtherErrorArea.classList.remove("d-none")
            divOtherErrorArea.innerText = errors.otherErrors
        }
    }