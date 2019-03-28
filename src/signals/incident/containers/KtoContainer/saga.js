// TEMP
/* eslint-disable */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { REQUEST_KTA_ANSWERS, CHECK_KTO, STORE_KTO } from './constants';
import {
  requestKtaAnswersSuccess, requestKtaAnswersError,
  checkKtoSuccess, checkKtoError,
  storeKtoSuccess, storeKtoError
} from './actions';

export function* requestKtaAnswers(action) {
  const requestURL = `${CONFIGURATION.API_ROOT_MLTOOL}signals/v1/public/feedback/standard_answers/`;
  try {
    const yesNo = action.payload;
    const result = yield call(request, requestURL);

    const answers = {};
    result.results.forEach((answer) => {
      if ((yesNo === 'ja') === answer.is_satisfied) {
        answers[answer.text] = answer.text;
      }
    });

    yield put(requestKtaAnswersSuccess(answers));
  } catch (error) {
    yield put(requestKtaAnswersError());
  }
}

export function* checkKto(action) {
  const requestURL = `${CONFIGURATION.API_ROOT_MLTOOL}signals/v1/public/feedback/forms`;

  // try {
    // const uuid = action.payload;
    // const result = yield call(request, `${requestURL}/${uuid}`);
    yield put(checkKtoSuccess());
  // } catch (error) {
    // TEMP
    // error.response.jsonBody = { detail: 'too late' }; // too late | filled out
    // if (error.response.status === 404) {
      // yield put(push('/niet-gevonden'));
    // }
    // const message = error.response && error.response.jsonBody && error.response.jsonBody.detail;
    // yield put(checkKtoError(message || true));
  // }
}

export function* storeKto(action) {
  // const requestURL = `${CONFIGURATION.API_ROOT_MLTOOL}signals/v1/public/feedback/forms`;
  // try {
    // const payload = action.payload;
    // const result = yield call(request, `${requestURL}/${payload.uuid}`, {
      // method: 'PUT',
      // body: JSON.stringify(action.payload.form),
      // headers: {
        // 'Content-Type': 'application/json'
      // }
    // });

    yield put(storeKtoSuccess());
  // } catch (error) {
    // console.log('storeKto failed');
//
    // yield put(storeKtoError(error));
  // }
}

export default function* watchKtoContainerSaga() {
  yield all([
    takeLatest(REQUEST_KTA_ANSWERS, requestKtaAnswers),
    takeLatest(CHECK_KTO, checkKto),
    takeLatest(STORE_KTO, storeKto)
  ]);
}
