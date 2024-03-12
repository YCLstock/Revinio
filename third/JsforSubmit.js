var IDs = [];
var AllData = [];

function saveBasic(data){
    AllData = data;
}

function saveIDs(data){
    var index = IDs.indexOf(data);
    if(index !== -1){
        IDs.splice(index, 1);
    }
    else{
        IDs.push(data);
    }
}

function FunctionForSubmit(){
    if(!document.getElementById('IDforSubmitDiv')){
        var showfinal = document.createElement("div");
        showfinal.id = 'IDforSubmitDiv';
        showfinal.style.position = "absolute";
        showfinal.style.backgroundColor = "white";
        showfinal.style.border = "1px solid black";
        showfinal.style.display = "flex";
        showfinal.style.left = "260px";
        showfinal.style.top = "100px";
        showfinal.style.height = "480px";
        showfinal.style.width = "1000px";
        showfinal.style.flexDirection = "column";

        document.body.appendChild(showfinal);

        var TitleForSubmit = document.createElement("h1");
        TitleForSubmit.innerText = "Your Choice(s):";
        TitleForSubmit.style.height = "30px";
        TitleForSubmit.style.width = "200px";
        TitleForSubmit.style.margin = "10px";
        TitleForSubmit.style.display = "inline";
        TitleForSubmit.style.fontSize = "20px";

        showfinal.appendChild(TitleForSubmit);

        var ButtonForShowfinal = document.createElement("button");
        ButtonForShowfinal.innerText = "X";
        ButtonForShowfinal.style.height = "20px";
        ButtonForShowfinal.style.width = "20px";
        ButtonForShowfinal.style.marginLeft = "975px";
        ButtonForShowfinal.style.marginTop = "-40px";
        ButtonForShowfinal.style.cursor = "pointer";

        ButtonForShowfinal.addEventListener("click", ()=> {
            document.body.removeChild(showfinal);
        });

        showfinal.appendChild(ButtonForShowfinal);

        var bigDiv = document.createElement("div");
        bigDiv.style.flexDirection = "row";
        bigDiv.style.width = "1000px";
        bigDiv.style.height = "550px";
        showfinal.appendChild(bigDiv);

        var filterData = [];
        for(let i = 0; i < AllData.basic_information.length; i++){
            for(let j = 0; j < IDs.length; j++){
                if(IDs[j] == (AllData.basic_information[i].C_id)){
                    filterData.push(AllData.basic_information[i]);
                }
            }
        }

        for(let x = 0; x<filterData.length; x++){
            var infoDiv = document.createElement("div");
            infoDiv.id = 'infoDiv_'+x;
            infoDiv.style.border = "1px solid black";
            infoDiv.style.height = "360px";
            infoDiv.style.width = "300px";
            infoDiv.style.margin = "15px";
            infoDiv.style.marginTop = "20px";
            infoDiv.style.display = "inline-block";
            infoDiv.innerHTML = `
                <img style="height:298px;width:298px" src="../ai_picture/square/${filterData[x].C_photo}">
                <h1 style="text-align:center;font-size:25px;margin-top:10px">${filterData[x].C_name}</h1>`;

            bigDiv.appendChild(infoDiv);
        }

        var textForSubmit = document.createElement("p");
        textForSubmit.innerText = "Interview invitation has been sent to the selected candidate.";
        textForSubmit.style.height = "50px";
        textForSubmit.style.width = "980px";
        textForSubmit.style.margin = "10px";
        textForSubmit.style.display = "inline";
        textForSubmit.style.fontSize = "20px";
        textForSubmit.style.textAlign = "right";

        showfinal.appendChild(textForSubmit);
    }
}