import React from 'react'
import WidgetStore from '../store/WidgetStore'
import Store from '../store/Store'
import FormInputBasic from './Input/FormInputBasic'
import InputText from './Input/InputText'
import SummitBtn from './SummitBtn'

class FormText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Text',
      value: '',
      datasource: '',       
      body: '',
      filter: ',',
      filterIndex: 0,
      startText: '',
      endText: ''
    }
    this.handlePayload = this.handlePayload.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    let editWidget = nextProps.editWidget
    if (editWidget) {
      Object.keys(editWidget).forEach((objectKey) => {
        if (objectKey !== 'widgetId') {
          return this.setState({
            [objectKey]: editWidget[objectKey]
          })
        }
      });
    } else this.reState()
  }
  reState () {
    this.setState({
      title: 'Text',
      value: '',
      datasource: '',       
      body: '',
      filter: ',',
      filterIndex: 0,
      startText: '',
      endText: ''
    })
  }
  handlePayload(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) =>{
    e.preventDefault()
    const editWidget = this.props.editWidget
    let payload = {
      typeWidget: 'Text',
      title: this.state.title,
      value: this.state.value,
      body: this.state.body,
      datasource: this.state.datasource,
      filter: this.state.filter,
      filterIndex: this.state.filterIndex,
      startText: this.state.startText,
      endText: this.state.endText
    }
    if (editWidget)  
      WidgetStore.updateWidget(editWidget.widgetId, payload)
    else 
      WidgetStore.createWidget(Store.currentId, payload)
    this.reState()
  }
  render() {
    const payload = this.state
    return (
      <div className="FormProgressBar container">
        <FormInputBasic callback={this.handlePayload} values={payload} />
        <InputText callback={this.handlePayload} title="Start Text" name="startText" value={payload.startText} />
        <InputText callback={this.handlePayload} title="End Text" name="startText" value={payload.endText} />
        <SummitBtn handleSubmit={this.handleSubmit} editWidget={this.props.editWidget}/>
      </div>
    )
  }
}

export default FormText