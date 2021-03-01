// found from chess.com
function moveGrade(r, o) {
  var t = 1e3;
  var i, a, c, l, h, g, b, y, _, w, x = ["blunder", "mistake", "inaccuracy", "good", "excellent"], S = {
    blunder: [0, 40],
    mistake: [40, 60],
    inaccuracy: [60, 80],
    good: [80, 95],
    excellent: [95, 100]
  }, C = 4.9, E = .1215;
  if (r <= 0)
    return {
      letter: x[4],
      number: 100,
      gradeIndex: 4
    };
  for (r = Math.min(t, r),
    i = function generateSdiffCutoffs(t) {
      var r = 20;
      return t = Math.min(r, Math.abs(t)),
      [.001776052 * Math.pow(t, 3) + -.018218136 * Math.pow(t, 2) + .303967449 * t + 2, .001304692 * Math.pow(t, 3) + -.011609068 * Math.pow(t, 2) + .205317058 * t + 1.1, .0004461266 * Math.pow(t, 3) + .0041181833 * Math.pow(t, 2) + .0141864828 * t + .5, .0002172109 * Math.pow(t, 3) + -.0010745878 * Math.pow(t, 2) + .0295840731 * t + .1, 0]
    }(o),
    a = 0; a < i.length; a += 1)
    if (!(r < i[a])) {
      c = a;
      break
    }
    return (l = x[c]) === x[0] ? (y = i[c],
      b = S.blunder[1],
      g = t / (t - y) * (r - y),
      h = b - C * (g = Math.min(t, g)) / (1 + E * g)) : (_ = S[l][0],
      b = S[l][1],
      h = _ + (r - (w = i[c - 1])) / ((y = i[c]) - w) * (b - _)),
      h = Math.min(100, h),
      {
          letter: l,
          number: h = Math.max(0, h),
          gradeIndex: c
      }
}

module.exports = { moveGrade };
