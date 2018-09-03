'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Table extends React.Component {

  static propTypes = {
    base: PropTypes.number.isRequired,
    upTo: PropTypes.number.isRequired,
    random: PropTypes.bool.isRequired
  }

  static defaultProps = {
    upTo: 12,
    random: true
  }

  constructor(props) {
    super(props);
    const methods = ['clickNext', 'reveal', 'markRight', 'markWrong', 'clickStart']
    this.state = {
      attempts: [],
      currentAttempt: [],
      attempting: 0,
      waiting: false
    }
    methods.forEach((n) => {
      this[n] = this[n].bind(this);
    })
  }

  get isComplete() {
    return !this.state.currentAttempt.length;
  }

  componentDidMount() {
    // this.start();
  }

  newAttempt() {
    const { upTo } = this.props;
    const currentAttempt = new Array(upTo).fill(null).map((v, i) => i + 1)
    const attempts = this.state.attempts.concat([{
      correct: [],
      incorrect: []
    }])
    this.setState({
      currentAttempt,
      attempts 
    })
  }

  start() {
    this.newAttempt();
    window.setTimeout(() => {
      this.next();
    },0)
  }

  clickStart(e) {
    e.preventDefault();
    this.start();
  }

  clickNext(e) {
    e.preventDefault();
    this.next();
  }

  reveal(e) {
    e.preventDefault()
    this.setState({waiting: false})
  }

  next() {
    let currentAttempt = this.state.currentAttempt.concat([]);
    let i = this.props.random ? Math.floor(Math.random() * currentAttempt.length - 1) + 1 : 0;
    // debugger;
    let attempting = currentAttempt.splice(i, 1)[0]
    this.setState({
      attempting,
      currentAttempt,
      waiting: true
    })
  }

  markRight(e) {
    e.preventDefault()
    this.mark(true);
    this.next();
  }

  markWrong(e) {
    e.preventDefault()
    this.mark(false);
    this.next();
  }

  mark(correct=true) {
    const attempts = this.state.attempts.concat([]);
    const update = (correct) ? 'correct' : 'incorrect';
    attempts[attempts.length - 1][update].push(this.state.attempting);
    this.setState({ attempts })
  }

  renderReveal() {
    if (this.state.waiting) {
      return <button onClick={ this.reveal }>REVEAL ANSWER</button>
    } else {
      return null;
    }
  }

  renderResult() {
    if (!this.state.waiting) {
      return <React.Fragment>
        <button onClick={ this.markRight }>I was right!</button>
        <button onClick={ this.markWrong }>I was wrong.</button>
      </React.Fragment>
    } else {
      return null;
    }
  }

  renderStart() {
    if (this.isComplete) {
      return <button onClick={ this.clickStart }>START</button>
    } else {
      return null;
    }
  }

  render() {
    const { base } = this.props;
    const { attempting, waiting } = this.state;
    return <div className="card">
      <div className="problem">{attempting} x {base}</div>
      <div className="answer">{ (waiting) ? '???' : attempting * base }</div>
      { this.renderReveal() }
      { this.renderResult() }
      { this.renderStart() }
    </div>
  }
}

class App extends React.Component {
  static propTypes = {
    upTo: PropTypes.number.isRequired
  }

  static defaultProps = {
    upTo: 20
  }

  constructor(props) {
    super(props);
    this.toc = new Array(props.upTo).fill(null).map((v, i) => i + 1)
    this.state = {
      table: 1
    }
    this.selectTable = this.selectTable.bind(this)
  }

  selectTable(e) {
    let table = e.target.getAttribute('data-table')
    this.setState({table: parseInt(table)})
  }

  render() {
    return <div>
      <nav>
        { this.toc.map(i => <span onClick={ this.selectTable } key={ `choose-${i}`} data-table={i}>{i}</span>) }
      </nav>
      <Table base={this.state.table}/>
    </div>
  }
}

ReactDOM.render(<App/>, document.getElementById('content'));