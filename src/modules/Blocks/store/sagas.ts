import { call, put, takeLatest, fork, delay } from 'redux-saga/effects';
import withLoading from '@/sagaMiddleware/index';
import * as api from './apis';
import * as actions from './actions';
import * as types from './constants';

const blockPollingInterval = 5000;

export function* getBlock(action: ReturnType<typeof actions.getBlock>) {
  try {
    const res = yield call(withLoading, api.getBlock, action.type, action.payload);
    yield put(actions.setBlock(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetBlock() {
  yield takeLatest(types.GET_BLOCK, getBlock)
}


export function* getBlockByHeight(action: ReturnType<typeof actions.getBlock>) {
  try {
    const res = yield call(withLoading, api.getBlockByHeight, action.type, action.payload);
    yield put(actions.setBlock(res));
  } catch (err) {
    if (err.message) {
      console.log(err.message);
    }
  }
}

function* watchGetBlockByHeight() {
  yield takeLatest(types.GET_BLOCK_BY_HEIGHT, getBlockByHeight)
}

export function* getBlockList(action: ReturnType<typeof actions.getBlockList>): any {
  try {
    const res = yield call(withLoading, api.getBlockList, action.type, action.payload);
    yield put(actions.setBlockList(res));
    if (action.callback) {
      yield call(action.callback);
    }
    if (action.payload.page === 1) {
      yield delay(blockPollingInterval);
      yield fork(getBlockList, action);
    }
  } catch (err) {
    if (err.message) {
      yield put(actions.setBlockList([]));
    }
  }
}

function* watchGetBlockList() {
  yield takeLatest(types.GET_BLOCK_LIST, getBlockList)
}

const sagas = [
  watchGetBlock,
  watchGetBlockByHeight,
  watchGetBlockList
];

export default sagas;