const app = Vue.createApp({
    data() {
      return {
        basic_information: [],
        academic: [],
        other_experience: [],
        work_experience: [],
        skill: [],
        relation_table_we_s: [],
        relation_table_oe_s: [],
        note_check: [],
      }
    },
    mounted() {
      fetch('../api.php')
        .then(response => response.json())
        .then(data => {
          this.basic_information = data.basic_information;
          this.academic = data.academic;
          this.other_experience = data.other_experience;
          this.work_experience = data.work_experience;
          this.skill = data.skill;
          this.relation_table_we_s = data.relation_table_we_s;
          this.relation_table_oe_s = data.relation_table_oe_s;
          this.note_check = data.note_check;
          const basic_information = this.basic_information;
          const Data_a = this.academic;
          const AllData_a = preprocess(Data_a);
          const Data_w = this.work_experience;
          const AllData_w = preprocess_w(Data_w);
          const note = this.note_check;
          // const AllData_w = preprocess(Data_w);
          var mergedData_a = [];
          var mergedData_w = [];
          AllData_a.forEach(function(obj1) {
            var matchingObj = basic_information.find(function(obj2) {
              return obj1.C_id === obj2.C_id; // 假设 property 是要匹配的属性
            });
          
            if (matchingObj) {
              var mergedObj = Object.assign({}, obj1, matchingObj);
              mergedData_a.push(mergedObj);
            }
          });

          AllData_w.forEach(function(obj1) {
            var matchingObj = basic_information.find(function(obj2) {
              return obj1.C_id === obj2.C_id; // 假设 property 是要匹配的属性
            });
          
            if (matchingObj) {
              var mergedObj = Object.assign({}, obj1, matchingObj);
              mergedData_w.push(mergedObj);
            }
          });
          Filter_a(mergedData_a);
          Filter_w(mergedData_w);
          console.log(mergedData_w);
          loadComment(note);
          barChart(mergedData_a);
          barChart_w(mergedData_w);
          // more_div_work(Data_w );
          // dataProcess(mergedData);
          // fetch('updateData.php',{
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   }
            
          // })
        })
        .catch(error => {
          console.error('Failed to fetch data:', error);
        });
    },
  });
  
  app.mount('#back');  

function divClick(destination) {
    window.location.href = destination;
}