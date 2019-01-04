import React, { Component } from 'react'
import './index.scss';

class Home extends Component {
  render() {
    return (
      <main className="page-home">
        <div className="wrap">
          <h1 className="title">欢迎您! Pawn</h1>
          <div>
            <p>2016级计算机科学与技术</p>
            <p>李昌义的Python 课程设计</p>
            <p style={{textAlign: "right"}}>2018.12.12</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
