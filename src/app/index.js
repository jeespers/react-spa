import React from 'react';
import { render } from 'react-dom';
import { IdolMetadata } from './components/IdolMetadata.js';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {pageNbr: "&page="};

  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      programDefo: {}
     };

    var self = this;

    fetch("http://api.tv4play.se/site/programs/idol")
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.info("response from tv4play", response["participant_groups"][0]["participants"]);
      console.info("response raw", response);
      self.setState({
          participants: response["participant_groups"][0]["participants"],
          programName: response.name,
          programDescripton: response.description,
          programImg: response.top_image
      })
    });

  }



  activate = (item) => {
    console.log("item is ", item)
    var self = this;
    self.setState({videoList: [] });
    this.setState({activeTag: item.person_tag});


    fetch("http://api.tv4play.se/play/video_assets.json?tags=" + item.person_tag)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.info("response from tv4play", response.total_hits);
      self.setState({
        videoList: response.results,
        nbrOfPages: Math.ceil(response.total_hits/12)
      })
    });
  }




  render() {
    var self = this;
    return (
      <div>
      <div> {self.state.activeTag && <IdolMetadata />}</div>

      <div>
        <img src={this.state.programImg} />
      </div>
      
        <h1>{this.state.programName}</h1>
        <h2>{this.state.programDescripton}</h2>
        <ul>
            {self.state.participants.map(function(participant, i) {
                return (<li key={i} onClick={self.activate.bind(self, participant)} >
                <img src={participant.image.url} width='60' />
                    <p>{participant.name}</p>


                    { participant.person_tag == self.state.activeTag && self.state.videoList &&
                    (<div>
                        <p>{participant.description}</p>
                        <ul>
                        {self.state.videoList.map(function(videoId, i) {
                            return (
                                (<li key={i} ><a href={"http://www.tv4play.se/program/idol?video_id="+videoId.id}>{videoId.description}</a></li>))
                          })}
                            <p>{self.state.nbrOfPages}</p>
                      </ul>
                    </div>)}
                </li>)
            })}

        </ul>

      </div>

    );
  }
}

render(<App />, window.document.getElementById('app'));
