import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import ValidationError from '../ValidationError'
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      formValid: false,
      validationMessages: {
        name: '',
      }
    }
  }

  static defaultProps = {
    history: {
      push: () => { }
    },
  }

  updateName(name) {
    this.setState({ name }, () => { this.validateName(name) });
  }

  static contextType = ApiContext;

  handleSubmit = e => {
    e.preventDefault()
    const folder = {
      name: e.target['folder-name'].value
    }
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folders/${folder.id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  validateName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if (fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.name = 'Name must be at least 3 characters long';
        hasError = true;
      } else {
        fieldErrors.name = '';
        hasError = false;
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, () => {
      this.validateForm();
    });
  }

  validateForm = () => {
    this.setState({
        formValid: this.state.nameValid
    });
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input
              type='text'
              id='folder-name-input'
              name='folder-name'
              onChange={e => this.updateName(e.target.value)}
              />
          </div>
          <div className='buttons'>
            <button disabled={!this.state.formValid} type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
        <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name} />
      </section>
    )
  }
}
