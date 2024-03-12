var dictionary = {
  //department
    "computer science": "CSIE",
    "computer science and information": "CSIE",
    "computer science and information engineering": "CSIE",
    "computer science and information management": "CSIM",
    "data science": "DATA",
    "data science and big data analytics": "DATA",
    "electrical engineering": "EE",
    "information management": "IM",
    "economics": "ECON",
    "economic": "ECON",
    "economic and management": "ECON",
    "accounting": "ACC",
    "accounting & finance": "ACC",
    "finance": "FIN",
    "banking and finance": "FIN",
    "money and banking": "FIN",
    "mechanical engineering": "ME",
    "mechanical and electrical" : "ME",
    "business adminstration": "BA",
    "mathematics": "MATH",
    "applied mathematics" : "MATH",
    "applied mathematics with computing": "MATH",
    "sales and marketing": "S&M",
    "marketing": "S&M",
    "psychology": "PSY",
    "human resources management": "HR",
    "human resources" : "HR",
    "library information science": "LIS",
    "library and information science": "LIS",
    "business adiministraion": "BA",
    "business management": "BA",
    "international business": "IB",
    "biological science and technology": "BST",
    "chinese": "CHIN",
    "chinese literature": "CHIN",
    "civil engineering": "CIE",
    "physics": "PHYS",
    "foreign languages and literatures": "FL",
    "english": "FL",
    "foreign languages and applied linguistics": "FL",
    "journalism": "JOUR",
    "department of management science": "MS",
    "engineering and system science": "ESS",
    "manufacturing information and systems": "IMIS",
  //position
    "front-end developer": "FE",
    "front-end supervisor": "FE",
    "frontend developer": "FE",
    "front-end architect": "FE",
    "front-end designer": "FE",
    "front-end performance engineer": "FE",
    "web developer": "FE",
    "web designer": "FE",
    "website engineer": "FE",
    "web analytics specialist": "FE",
    "mobile front-end developer": "FE",
    "cloud front-end developer": "FE",
    "ui/ux designer": "UI/UX",
    "ux researcher": "UI/UX",
    "ux/ui designer": "UI/UX",
    "full-stack developer": "FSW",
    "full stack developer": "FSW",
    "ai/machine learning engineer":"MLE",
    "data analyst": "DA",
    "it project manager": "PM",
    "project manager": "PM",
    "database administrator": "DBA",
    "system administrator": "SA",
    "ai engineer": "AIE",
    "iot engineer": "IOT",
    "data scientist": "DS",
    "information security specialist": "ISS",
    "network engineer": "NE",
    "software engineer": "SDE",
    "it manage": "IT MGR"
};
function preprocess(data){
    groupedData = data.map(item => ({ ...item }));

    var searchStr = "department of ";
    var searchStr1 = " department";
    var searchStr2 = "institute of";

    var regex = new RegExp(searchStr, "gi");
    var regex1 = new RegExp(searchStr1, "gi");
    var regex2 = new RegExp(searchStr2, "gi");

    for(var i = 0;i < groupedData.length; i++){
        groupedData[i].school_department = groupedData[i].school_department.replace(regex, "");
        groupedData[i].school_department = groupedData[i].school_department.replace(regex1, "");
        groupedData[i].school_department = groupedData[i].school_department.replace(regex2, "");
    }

    groupedData = replaceAttribute(groupedData);
    return groupedData
}

// 替换属性值函数
function replaceAttribute(data) {
    return data.map(item => {
      const department = item.school_department.toLowerCase();
      const replacement = dictionary[department];
      const originalDepartment = 
      replacement === "CSIE" ? "Computer Science" : 
      replacement === "MATH" ? "Mathematics" : 
      replacement === "HR" ? "Human Resources Management" : 
      replacement === "S&M" ? "Sales and Marketing" : 
      replacement === "LIS" ? "Library Information Science" : 
      replacement === "ME" ? "mechanical engineering" : 
      replacement === "ACC" ? "accounting" : 
      replacement === "FIN" ? "Finance" :
      item.school_department;
      return {
        ...item,
        original_department: originalDepartment, // 存储原始的字串
        school_department: replacement || "OTHER",
      };
    });
  }

  function preprocess_w(data){
    groupedData = data.map(item => ({ ...item }));

    // var searchStr = "department of ";
    // var searchStr1 = " department";

    // var regex = new RegExp(searchStr, "gi");
    // var regex1 = new RegExp(searchStr1, "gi");

    // for(var i = 0;i < groupedData.length; i++){
    //     groupedData[i].work_position = groupedData[i].work_position.replace(regex, "");
    //     groupedData[i].work_position = groupedData[i].work_position.replace(regex1, "");
    // }

    groupedData = replaceAttribute_w(groupedData);
    return groupedData
}

// 替换属性值函数
function replaceAttribute_w(data) {
    return data.map(item => {
      const position = item.work_position.toLowerCase();
      const replacement = dictionary[position];
      const originalPosition = 
      replacement === "FE" ? "Front-end Developer" : 
      replacement === "UI/UX" ? "UI/UX Designer" : 
      replacement === "FSW" ? "Full-stack Developer" : 
      replacement === "MLE" ? "Machine Learning Engineer" : 
      replacement === "DA" ? "Data Analyst" : 
      replacement === "PM" ? "Project Manager" : 
      item.work_position;
      return {
        ...item,
        original_position: originalPosition, // 存储原始的字串
        work_position: replacement || "OTHER",
      };
    });
  }