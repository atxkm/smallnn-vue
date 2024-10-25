
import axios from "axios";

export function getProcess(row) {
  let timer;

  function run () {
    axios
      .get(`/backend/progress?package=${row.package}&flag=tk`)
      .then(({ data }) => {
        timer=setTimeout(()=>run(row),1000);
        if (data?.progress > 0) {
          row.progress = parseInt(data?.progress * 10000)/100;
          if (row.progress>=100) {
          clearTimeout(timer);
        }
        } else {
          clearTimeout(timer);
        }
      });
  }
  run();
}