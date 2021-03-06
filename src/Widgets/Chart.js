import React from 'react'
import WidgetStore from '../store/WidgetStore'
import moment from 'moment'
import axios from 'axios'
import './Widget.css'
import HeaderCard from "./HeaderCard"
import Store from '../store/Store'
import { CSVLink } from "react-csv"

import {
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, Area,
  AreaChart, ResponsiveContainer
} from 'recharts'

class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        { key: 0 }
      ],
      csv: [],
      filterSince: '1hour'
    }
    this.handleFilter = this.handleFilter.bind(this)
  }

  delWidget() {
    const widgetId = this.props.widgetId
    WidgetStore.deleteWidget(widgetId)
  }

  componentDidMount() {
    this.getData(this.state.filterSince)
  }

  getData(filterSince) {
    let granularity = ''
    let cased = 'hour'
    switch (filterSince) {
      case '24hours': granularity = '30minutes'
        cased = 'hour'
        break
      case '3days': granularity = '1hour'
        cased = 'day'
        break
      case '7days': granularity = '3hours'
        cased = 'day'
        break
      default: granularity = '15seconds'
    }
    const payload = this.props.payload
    if (payload.feedID !== '') {
      const netpieAPI = 'https://api.netpie.io/feed/'
      let value = ''
      payload.values.map((val) => value += val.value + ',')
      axios.get(netpieAPI + payload.feedID
        + '?apikey=' + payload.feedAPI
        + '&granularity=' + granularity
        + '&since=' + filterSince
        + '&filter=' + value.substr(0, value.length - 1)
      ).then((res) => {
        let csv = []
        res.data.data.map((data, index) => {
          data.values.map((val, i) => {
            if (!csv[i]) {
              csv.push({
                'time': moment(val[0]).format('MM-DD-YYYY, H:mm:ss'),
              })
            }
            csv[i][data.attr] = val[1].toFixed(2)
            return (0)
          })
          return (0)
        })
        this.setState({
          data: res.data.data.map((data, index) => {
            let objAttr = data.values.map((val) => {
              let obj = []
              if (index === 0) {
                obj = {
                  'timestamp':  moment(val[0]).format('MM-DD-YYYY, H:mm'),
                  ['value' + index]: parseFloat(val[1].toFixed(2))
                }
              } else {
                obj = parseFloat(val[1].toFixed(2))
              }
              return obj
            })
            return (objAttr)
          }),
          csv: csv
        })
      })
    } else {
      let obj = []
      let csv = []
      payload.values.map((val, index) =>
        axios.get(Store.server + '/sensor/' + val.value + '/' + cased + '=' + parseInt(filterSince, 10))
          .then(res => {
            obj[index] = res.data.map((data, i) => {
              if (!csv[i]) {
                csv.push({
                  'time': moment(data.timestamp).format('MM-DD-YYYY, H:mm:ss'),
                })
              }
              csv[i][data.metadata.name] = data.desired.value.toFixed(2)
              if (index === 0)
                return ({
                  'timestamp': moment(data.timestamp).format('MM-DD-YYYY, H:mm'),
                  ['value' + index]: parseFloat(data.desired.value).toFixed(2)
                })
              else
                return (
                  parseFloat(data.desired.value).toFixed(2)
                )
            })
            this.setState({
              data: obj,
              csv: csv
            })
          })
      )
    }

  }

  handleFilter(e) {
    this.setState({
      filterSince: e.target.value
    })
    this.getData(e.target.value)
  }

  formatXAxis = (tickItem) => {
    const filterSince = this.state.filterSince
    if (filterSince === '1hour' || filterSince === '8hours' || filterSince === '24hours')
      return moment(tickItem).format('HH:mm')
    else
      return moment(tickItem).format('DD-MM-YY')
  }
  checkBtnTime(since) {
    if (this.state.filterSince === since) return 'btn btn-primary btn-sm'
    else return 'btn btn-secondary btn-sm'
  }
  render() {
    const payload = this.props.payload
    const widgetId = this.props.widgetId
    const data = this.state.data
    var areaColor = []
    var start = parseInt(Store.colorSet[Store.colorUse].colors[2].substr(1), 16)
    var stop = (parseInt(Store.colorSet[Store.colorUse].colors[12].substr(1), 16)) ?
      parseInt(Store.colorSet[Store.colorUse].colors[12].substr(1), 16) :
      parseInt(Store.colorSet[Store.colorUse].colors[13].substr(1), 16)
    if (stop < start) start = [stop, stop = start][0];
    let shade = parseInt((stop - start) / data.length, 10)

    for (let i = 0; i < data[0].length; i++) {
      data.map((datas, index) => 
        data[0][i] = Object.assign({ ['value' + index]: data[index][i] }, data[0][i])
      )
    }
    console.log(data[0])
    return (
      <div className="item-content card chart shadowcard rounded-0 widgetChart border-0 col-12 h-100" data-id={widgetId}>
        <HeaderCard title={payload.title} payload={payload} del={this.delWidget.bind(this)} widgetId={widgetId} />
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="btn-group mb-2" role="group" aria-label="DayMonthYear" id="scrollbar-style">
                <button type="button"
                  className={this.checkBtnTime('1hour')}
                  value='1hour'
                  onClick={this.handleFilter}
                >
                  Last 1 hours
                </button>
                <button type="button"
                  className={this.checkBtnTime('8hours')}
                  value='8hours'
                  onClick={this.handleFilter}
                >
                  Last 8 hours
                </button>
                <button type="button"
                  className={this.checkBtnTime('24hours')}
                  value='24hours'
                  onClick={this.handleFilter}
                >
                  Last 24 Hours
                </button>
                <button type="button"
                  className={this.checkBtnTime('3days')}
                  value='3days'
                  onClick={this.handleFilter}
                >
                  Last 3 Days
                </button>
                <button type="button"
                  className={this.checkBtnTime('7days')}
                  value='7days'
                  onClick={this.handleFilter}
                >
                  Last 7 Days
                </button>
              </div>

              {this.state.csv.length > 2 ? <CSVLink
                filename={"export.csv"}
                data={this.state.csv}>
                <span className="download-btn">
                  <i className="fas fa-file-download"></i>
                  <br /><p className="text-download">export</p>
                </span>
              </CSVLink> : null}
            </div>
          </div>

          <ResponsiveContainer width='100%' height={250}>
            <AreaChart data={ data[0]}
              margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
            >
              <defs>

                {
                  payload.values.map((data, index) => {
                    areaColor.push('#' + (start + shade * index).toString(16))
                    return <linearGradient key={index} id={'color' + index} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={areaColor[index]} stopOpacity={0.7} />
                      <stop offset="95%" stopColor={areaColor[index]} stopOpacity={0} />
                    </linearGradient>
                  })
                }
              </defs>

              <XAxis
                dataKey="timestamp"
                reversed={true}
                tickFormatter={this.formatXAxis}
                domain={['dataMin', 'dataMax']}
                minTickGap={70}
              />
              <YAxis />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              {
                payload.values.map((data, index) =>
                  <Area
                    key={index}
                    name={payload.values[index].value}
                    type={payload.type}
                    dataKey={'value' + index}
                    stroke={areaColor[index]}
                    fillOpacity={payload.fillOpacity}
                    fill={'url(#color' + index + ')'} />
                )
              }
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }
}

export default Chart