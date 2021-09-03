const { exit } = require('./exit')

// proxy to joi for option validation
export function createSchema (fn) {
  const joi = require('joi')

  let schema = fn(joi)
  if (typeof schema === 'object' && typeof schema.validate !== 'function') {
    schema = joi.object(schema)
  }

  return schema
}

export function validate(obj, schema, cb) {
  const { error } = schema.validate(obj)
  if (error) {
    cb(error.details[0].message)

    if (process.env.VUE_CLI_TEST) {
      throw error
    } else {
      exit(1)
    }
  }
}

export function validateSync(obj, schema){
  const { error } = schema.validate(obj)
  if (error) {
    throw error
  }
}


