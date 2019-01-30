export function shuffle (arr) {
  // _arr为arr的副本，已达到不改变原数组的目的
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let tmp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = tmp
  }
  return _arr
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
