import axios from 'axios'
const  StatisticsUrl='https://service-4q25lrye-1300862921.gz.apigw.tencentcs.com/release/user_behavior_statistics_handler';

export default function userBehaviorStatistics(fields) {
  return axios({
    method: 'post',
    url: StatisticsUrl,
    data: fields,
  })
}
