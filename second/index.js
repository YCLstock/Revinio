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
        note_check: []
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
          console.log(this.data);
          choose_id(data);
          //main_graph(data);
          //simple_graph(data);
          x_axis(data);
          // skill(data);
          // lan(data); 
          drag();
          //sorting(data);
          // const AllData = this.basic_information;
          // drawBarChart(AllData);
          // console.log(AllData);
          
        })
        .catch(error => {
          console.error('Failed to fetch data:', error);
        });
    }
  });
  
  app.mount('#app');  

function divClick(destination) {
    window.location.href = destination;
}