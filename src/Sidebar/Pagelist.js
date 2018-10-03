import React, { Component } from 'react'
import './Pagelist.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'
import socketIOClient from 'socket.io-client'

let server = 'http://172.18.6.7:5582'
const socket = socketIOClient(server)

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addPage: false,
      pages: [],
      inputName: '',
      editPage: null,
      selectPage: 0
    }
  }

  componentWillMount() {
    this.response()
  }

  response = () => {
    this.getBoard()
    socket.on('update-board', (msg) => {
      console.log('update-board', msg)
      this.getBoard()
    })
  }

  getBoard = () => {
    let pages = []
    axios.get(server + '/board/').then((res) => {
      res.data.map((board) =>
        pages.push({
          id: board._id,
          name: board.boardName
        })
      )
      this.setState({
        pages: pages
      })
    })
  }

  handleClick = (e) => {
    e.preventDefault();
    this.props.callback(!this.props.mode);
  }

  handleClickAdditem = (e) => {
    e.preventDefault();
    this.setState({
      addPage: true
    })
  }

  savePage = (index, pageId) => {
    let tem = this.state.pages
    if (this.state.inputName !== '') {
      let payload = {
        boardName: this.state.inputName
      }
      if (index === -1) {
        axios.post( server + '/board/', payload ).then((res) => {
          console.log(res)
        })
      }
      else {
        axios.put( server + '/board/' + pageId, payload).then((res) => {
          console.log(res)
        })
      }
      this.setState({
        pages: tem,
        addPage: false,
        inputName: '',
        editPage: null,
        selectPage: tem.length - 1
      })
    }
  }

  handleChange(e) {
    this.setState({ inputName: e.target.value });
  }

  handleKeyPress = (objKeypress, e) => {
    if (e.key === 'Enter') {
      let index = objKeypress.index
      let pageId = objKeypress.pageId
      this.savePage(index, pageId)
    }
  }

  clickEdit = (index) => {
    this.setState({
      editPage: index,
      inputName: this.state.pages[index].name
    })
  }

  deletePage = (pageId) => {
    axios.delete( server + '/board/' + pageId).then((res) => {
      console.log(res)
    })
  }

  handleClickpage = (index) => {
    this.setState({
      selectPage: index
    })
  }

  render() {
    let listPage = []
    const {pages, editPage} = this.state
    let lspage

    let addPage = <a onClick={this.handleClickAdditem} className="second"><i className="fas fa-plus-square"></i> new page</a>
    if (this.state.addPage) {
      let objKeypress = {
        index: -1,
        pageId: 0
      }
      addPage =
        <div className="input-group addpage">
          <input type="text" className="form-control addpage border-0 rounded-0 " 
            onBlur={() => this.savePage(-1)} 
            onKeyPress={this.handleKeyPress.bind(this, objKeypress)} 
            placeholder="new page" aria-label="new page" 
            onChange={this.handleChange.bind(this)} 
            aria-describedby="button-addon2" />
          <div className="input-group-append">
            <button className="btn rounded-0 editbtn bg-transparent" type="button" id="button-addon2" onClick={() => this.savePage(-1)}>
              <i className="fas fa-save"></i>
            </button>
          </div>
        </div>
    }
    listPage = pages.map((page, index) => {
      let objKeypress = {
        index: index,
        pageId: page.id
      }
      if (editPage !== index) {
        lspage =
            <li className={(this.state.selectPage === index) ? 'active' : ''}><span onClick={() => this.handleClickpage(index)}>
              <div className="row">
                <div className="col-sm-9">
                  {page.name}
                </div>
                <div className="col-sm-2 editmenu px-0">
                  <i className="fas fa-pen-square editbtn mr-1" onClick={() => this.clickEdit(index)}></i>
                  <i className="fas fa-minus-square editbtn" onClick={() => this.deletePage(page.id)}></i>
                </div>
              </div>
            </span>
          </li>
      } else {
        lspage =
          <div className="input-group addpage">
            <input type="text" className="form-control addpage border-0 rounded-0 " 
              value={this.state.inputName} 
              onBlur={() => this.savePage(index, page.id)} 
              onKeyPress={this.handleKeyPress.bind(this, objKeypress)} 
              placeholder="new page" aria-label="new page" 
              onChange={this.handleChange.bind(this)} 
              aria-describedby="button-addon2" 
              autoFocus />
            <div className="input-group-append">
            </div>
          </div>
      }
      return <Link to={'/' + page.id} key={page.id}>{lspage}</Link>
    })
    return (
      <ul className="list-unstyled components">
        <li>
          <a href="#pageSubmenu" data-toggle="collapse" aria-haspopup="true" aria-expanded="false">Pages</a>
          <ul className="collapse list-unstyled" id="pageSubmenu">
            {listPage}
            <li>{addPage}</li>
          </ul>
        </li>
      </ul>
    )
  }
}


export default Page