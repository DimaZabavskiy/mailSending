import React from 'react';
import PropTypes from 'prop-types';

import isoFetch from 'isomorphic-fetch';

class ExampleComponent extends React.PureComponent {

  static propTypes = {
  };

  state = {
    imagePath: '',
  }

  chooseImage = (e) => {
    this.setState({
      imagePath: e.target.value,
    })
  }

  sendMessage = () => {
      console.log('sendMessage pressed');
    isoFetch('http://localhost:8080/send/', )
        .then(function (response) {
          console.log('response: ', response)
          return response.text();
        })
        .then(function (data) {
            console.log('sendMessage data: ', data)
        })
        .catch(function (error) {
            console.error('sendMessage error: ', error);
        })
    ;
  }

  render() {
    const {state: {imagePath}} = this;

    return (
      <div>
        Пример компонента
        <div><input type="file" name='image' onChange={this.chooseImage}/></div>
        {
          imagePath &&
          <div> <img src={imagePath}/></div>
        }
        <div onClick={this.sendMessage}>ПОСЛАТЬ СООБЩЕНИЕ</div>
      </div>
    )
    ;

  }

}

export default ExampleComponent;
