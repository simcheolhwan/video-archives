import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { editBoard, deleteBoard } from '../actions/index'
import './BoardRead.css'
import VideoList from '../components/VideoList'
import ListAdd from '../components/ListAdd'

const propTypes = {
  videoStorage: React.PropTypes.object.isRequired,
  editBoard: React.PropTypes.func.isRequired,
  deleteBoard: React.PropTypes.func.isRequired
}

const defaultProps = {
  videoStorage: {},
  editBoard: () => console.log('editBoard not defined'),
  deleteBoard: () => console.log('deleteBoard not defined')
}

class BoardRead extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = { isEditing: false, title: '', slug: '', error: null }
    this.onTitleClick = this.onTitleClick.bind(this)
    this.onInputBlur = this.onInputBlur.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onPressEnter = this.onPressEnter.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
  }

  onTitleClick() {
    const currentBoard = _.find(this.props.videoStorage.boards, board => {
      return board.slug === this.props.params.boardSlug
    })
    const { title, slug } = currentBoard

    this.setState({ isEditing: true, title, slug })
  }

  onInputBlur() {
    const currentBoard = _.find(this.props.videoStorage.boards, board => {
      return board.slug === this.props.params.boardSlug
    })
    const { title, slug } = currentBoard

    this.setState({ isEditing: false, title, slug, error: null })
  }

  onInputChange(event) {
    const title = event.target.value
    const slug = title.trim().toString().toLowerCase().replace(/\s+/g, '-')
      .replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=/g, '-').replace(/\-\-+/g, '-')
    const boardExists = _.find(
      this.props.videoStorage.boards,
      board => {return slug === board.slug && slug !== this.props.params.boardSlug}
    )
    let error = null

    if (slug === 'trash') {
      error = 'Reserved board title'
    } else if (boardExists) {
      error = 'Board already exists'
    }

    this.setState({ title, slug, error })
  }

  onPressEnter() {
    const currentBoard = _.find(this.props.videoStorage.boards, board => {
      return board.slug === this.props.params.boardSlug
    })
    const title = this.state.title.trim()
    const { slug, error } = this.state

    if (title && slug && !error) {
      this.props.editBoard(currentBoard, { title, slug })
      this.context.router.push(slug)
      this.boardTitleInput.blur()
    }
  }

  onDeleteClick() {
    const currentBoard = _.find(this.props.videoStorage.boards, board => {
      return board.slug === this.props.params.boardSlug
    })

    if (confirm(`Delete ${currentBoard.title}?\nAll lists and videos will be deleted.`)) {
      this.props.deleteBoard(currentBoard)
      this.context.router.push('/')
    }
  }

  render() {
    const currentBoard = _.find(this.props.videoStorage.boards, board => {
      return board.slug === this.props.params.boardSlug
    })

    return (
      <section className="Page">
        <header className="PageHeader BoardHeader">
          <input
            className="PageTitle BoardTitle h1"
            type="text"
            onFocus={this.onTitleClick}
            onBlur={this.onInputBlur}
            onChange={this.onInputChange}
            onKeyPress={event => {if (event.key === 'Enter') this.onPressEnter()}}
            value={!this.state.isEditing ? currentBoard.title : this.state.title}
            ref={input => {this.boardTitleInput = input}}
          />

          <button className="BtnTrash btn-link" onClick={this.onDeleteClick}>🗑</button>
          {this.state.error &&
            <small>{this.state.error}</small>
          }
        </header>

        <main className="PageContent">
          <div className="PageContentInner BoardScroll">
            {
              _.find(
                this.props.videoStorage.videos,
                video => {
                  return video.board === currentBoard.slug && !video.list && !video.deleted
                }
              ) &&
              <div className="VideoWrapper">
                <VideoList
                  videoList={this.props.videoStorage.videos}
                  currentBoard={currentBoard}
                />
              </div>
            }

            {currentBoard.lists.map(list => {
              return (
                <div className="VideoWrapper" key={list.slug}>
                  <VideoList
                    list={list}
                    videoList={this.props.videoStorage.videos}
                    currentBoard={currentBoard}
                  />
                </div>
              )
            })}

            <div className="VideoWrapper">
              <article className="Card">
                <header className="CardHeader">
                  <ListAdd board={currentBoard} />
                </header>
              </article>
            </div>
          </div>
        </main>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { videoStorage: state.videoStorage }
}

BoardRead.propTypes = propTypes
BoardRead.defaultProps = defaultProps

export default connect(mapStateToProps, { editBoard, deleteBoard })(BoardRead)