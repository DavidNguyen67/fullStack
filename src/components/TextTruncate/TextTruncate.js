import React, { Component } from 'react';

class TextTruncate extends Component {
  render() {
    const { text, maxLength } = this.props;

    const truncatedText =
      text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    return (
      <div
        {...this.props}
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {truncatedText}
      </div>
    );
  }
}

export default TextTruncate;
