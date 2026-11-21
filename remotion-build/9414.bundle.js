"use strict";
(self["webpackChunkvideo_editor_remotion"] = self["webpackChunkvideo_editor_remotion"] || []).push([[9414],{

/***/ 9414
(__webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   effectPreviewLoaders: () => (/* binding */ effectPreviewLoaders)
/* harmony export */ });
// src/components/effect-preview-loaders.ts
var effectPreviewLoaders = {
  "@remotion/effects/brightness": () => __webpack_require__.e(/* import() */ 718).then(__webpack_require__.bind(__webpack_require__, 718)),
  "@remotion/effects/contrast": () => __webpack_require__.e(/* import() */ 5201).then(__webpack_require__.bind(__webpack_require__, 5201)),
  "@remotion/effects/color-correction": () => __webpack_require__.e(/* import() */ 6901).then(__webpack_require__.bind(__webpack_require__, 6901)),
  "@remotion/effects/color-key": () => __webpack_require__.e(/* import() */ 7378).then(__webpack_require__.bind(__webpack_require__, 7378)),
  "@remotion/effects/curves": () => __webpack_require__.e(/* import() */ 8655).then(__webpack_require__.bind(__webpack_require__, 8655)),
  "@remotion/effects/duotone": () => __webpack_require__.e(/* import() */ 9477).then(__webpack_require__.bind(__webpack_require__, 9477)),
  "@remotion/effects/exposure": () => __webpack_require__.e(/* import() */ 3048).then(__webpack_require__.bind(__webpack_require__, 3048)),
  "@remotion/effects/grayscale": () => __webpack_require__.e(/* import() */ 1648).then(__webpack_require__.bind(__webpack_require__, 1648)),
  "@remotion/effects/hue": () => __webpack_require__.e(/* import() */ 7447).then(__webpack_require__.bind(__webpack_require__, 7447)),
  "@remotion/effects/invert": () => __webpack_require__.e(/* import() */ 2399).then(__webpack_require__.bind(__webpack_require__, 2399)),
  "@remotion/effects/levels": () => __webpack_require__.e(/* import() */ 9030).then(__webpack_require__.bind(__webpack_require__, 9030)),
  "@remotion/effects/lut": () => __webpack_require__.e(/* import() */ 2098).then(__webpack_require__.bind(__webpack_require__, 2098)),
  "@remotion/effects/saturation": () => __webpack_require__.e(/* import() */ 8795).then(__webpack_require__.bind(__webpack_require__, 8795)),
  "@remotion/effects/shadows-highlights": () => __webpack_require__.e(/* import() */ 2088).then(__webpack_require__.bind(__webpack_require__, 2088)),
  "@remotion/effects/tint": () => __webpack_require__.e(/* import() */ 6076).then(__webpack_require__.bind(__webpack_require__, 6076)),
  "@remotion/effects/white-balance": () => __webpack_require__.e(/* import() */ 5917).then(__webpack_require__.bind(__webpack_require__, 5917)),
  "@remotion/effects/vibrance": () => __webpack_require__.e(/* import() */ 8149).then(__webpack_require__.bind(__webpack_require__, 8149)),
  "@remotion/effects/linear-gradient": () => __webpack_require__.e(/* import() */ 1829).then(__webpack_require__.bind(__webpack_require__, 1829)),
  "@remotion/effects/linear-gradient-tint": () => __webpack_require__.e(/* import() */ 6892).then(__webpack_require__.bind(__webpack_require__, 6892)),
  "@remotion/effects/thermal-vision": () => __webpack_require__.e(/* import() */ 1897).then(__webpack_require__.bind(__webpack_require__, 1897)),
  "@remotion/effects/blur": () => Promise.all(/* import() */[__webpack_require__.e(3431), __webpack_require__.e(8604)]).then(__webpack_require__.bind(__webpack_require__, 8604)),
  "@remotion/effects/lens-blur": () => __webpack_require__.e(/* import() */ 71).then(__webpack_require__.bind(__webpack_require__, 71)),
  "@remotion/effects/linear-progressive-blur": () => __webpack_require__.e(/* import() */ 8328).then(__webpack_require__.bind(__webpack_require__, 8328)),
  "@remotion/effects/radial-progressive-blur": () => __webpack_require__.e(/* import() */ 8386).then(__webpack_require__.bind(__webpack_require__, 8386)),
  "@remotion/effects/region-blur": () => Promise.all(/* import() */[__webpack_require__.e(3431), __webpack_require__.e(7391)]).then(__webpack_require__.bind(__webpack_require__, 7391)),
  "@remotion/effects/zoom-blur": () => __webpack_require__.e(/* import() */ 1932).then(__webpack_require__.bind(__webpack_require__, 1932)),
  "@remotion/effects/drop-shadow": () => Promise.all(/* import() */[__webpack_require__.e(3431), __webpack_require__.e(4461)]).then(__webpack_require__.bind(__webpack_require__, 4461)),
  "@remotion/effects/long-shadows": () => __webpack_require__.e(/* import() */ 7305).then(__webpack_require__.bind(__webpack_require__, 7305)),
  "@remotion/effects/glow": () => Promise.all(/* import() */[__webpack_require__.e(3431), __webpack_require__.e(428)]).then(__webpack_require__.bind(__webpack_require__, 428)),
  "@remotion/effects/outline": () => __webpack_require__.e(/* import() */ 6171).then(__webpack_require__.bind(__webpack_require__, 6171)),
  "@remotion/effects/light-trail": () => __webpack_require__.e(/* import() */ 1354).then(__webpack_require__.bind(__webpack_require__, 1354)),
  "@remotion/effects/evolve": () => __webpack_require__.e(/* import() */ 7856).then(__webpack_require__.bind(__webpack_require__, 7856)),
  "@remotion/effects/tear": () => __webpack_require__.e(/* import() */ 9263).then(__webpack_require__.bind(__webpack_require__, 9263)),
  "@remotion/effects/film-burn": () => __webpack_require__.e(/* import() */ 201).then(__webpack_require__.bind(__webpack_require__, 201)),
  "@remotion/effects/radial-wipe": () => __webpack_require__.e(/* import() */ 5650).then(__webpack_require__.bind(__webpack_require__, 5650)),
  "@remotion/effects/iris-wipe": () => __webpack_require__.e(/* import() */ 9214).then(__webpack_require__.bind(__webpack_require__, 9214)),
  "@remotion/effects/venetian-blinds": () => __webpack_require__.e(/* import() */ 5140).then(__webpack_require__.bind(__webpack_require__, 5140)),
  "@remotion/effects/mirror": () => __webpack_require__.e(/* import() */ 9158).then(__webpack_require__.bind(__webpack_require__, 9158)),
  "@remotion/effects/scale": () => __webpack_require__.e(/* import() */ 5127).then(__webpack_require__.bind(__webpack_require__, 5127)),
  "@remotion/effects/tile": () => __webpack_require__.e(/* import() */ 1991).then(__webpack_require__.bind(__webpack_require__, 1991)),
  "@remotion/effects/translate": () => __webpack_require__.e(/* import() */ 383).then(__webpack_require__.bind(__webpack_require__, 383)),
  "@remotion/effects/barrel-distortion": () => __webpack_require__.e(/* import() */ 2673).then(__webpack_require__.bind(__webpack_require__, 2673)),
  "@remotion/effects/chromatic-aberration": () => __webpack_require__.e(/* import() */ 6945).then(__webpack_require__.bind(__webpack_require__, 6945)),
  "@remotion/effects/magnify": () => __webpack_require__.e(/* import() */ 44).then(__webpack_require__.bind(__webpack_require__, 44)),
  "@remotion/effects/fisheye": () => __webpack_require__.e(/* import() */ 9724).then(__webpack_require__.bind(__webpack_require__, 9724)),
  "@remotion/effects/corner-pin": () => __webpack_require__.e(/* import() */ 1019).then(__webpack_require__.bind(__webpack_require__, 1019)),
  "@remotion/effects/page-turn": () => __webpack_require__.e(/* import() */ 2042).then(__webpack_require__.bind(__webpack_require__, 2042)),
  "@remotion/effects/sphere": () => __webpack_require__.e(/* import() */ 6748).then(__webpack_require__.bind(__webpack_require__, 6748)),
  "@remotion/effects/cylinder": () => __webpack_require__.e(/* import() */ 4165).then(__webpack_require__.bind(__webpack_require__, 4165)),
  "@remotion/effects/wave": () => __webpack_require__.e(/* import() */ 9320).then(__webpack_require__.bind(__webpack_require__, 9320)),
  "@remotion/effects/skew": () => __webpack_require__.e(/* import() */ 1901).then(__webpack_require__.bind(__webpack_require__, 1901)),
  "@remotion/effects/turbulent-displace": () => __webpack_require__.e(/* import() */ 8564).then(__webpack_require__.bind(__webpack_require__, 8564)),
  "@remotion/effects/burlap": () => __webpack_require__.e(/* import() */ 2049).then(__webpack_require__.bind(__webpack_require__, 2049)),
  "@remotion/effects/bevel-alpha": () => __webpack_require__.e(/* import() */ 4170).then(__webpack_require__.bind(__webpack_require__, 4170)),
  "@remotion/effects/emboss": () => __webpack_require__.e(/* import() */ 9378).then(__webpack_require__.bind(__webpack_require__, 9378)),
  "@remotion/effects/dot-grid": () => __webpack_require__.e(/* import() */ 2633).then(__webpack_require__.bind(__webpack_require__, 2633)),
  "@remotion/effects/halftone": () => __webpack_require__.e(/* import() */ 380).then(__webpack_require__.bind(__webpack_require__, 380)),
  "@remotion/effects/noise": () => __webpack_require__.e(/* import() */ 7331).then(__webpack_require__.bind(__webpack_require__, 7331)),
  "@remotion/effects/noise-displacement": () => __webpack_require__.e(/* import() */ 6513).then(__webpack_require__.bind(__webpack_require__, 6513)),
  "@remotion/effects/paper": () => __webpack_require__.e(/* import() */ 2419).then(__webpack_require__.bind(__webpack_require__, 2419)),
  "@remotion/effects/roughen-edges": () => __webpack_require__.e(/* import() */ 578).then(__webpack_require__.bind(__webpack_require__, 578)),
  "@remotion/effects/pattern": () => __webpack_require__.e(/* import() */ 4997).then(__webpack_require__.bind(__webpack_require__, 4997)),
  "@remotion/effects/pixel-dissolve": () => __webpack_require__.e(/* import() */ 5511).then(__webpack_require__.bind(__webpack_require__, 5511)),
  "@remotion/effects/pixelate": () => __webpack_require__.e(/* import() */ 9303).then(__webpack_require__.bind(__webpack_require__, 9303)),
  "@remotion/effects/linear-progressive-pixelate": () => Promise.all(/* import() */[__webpack_require__.e(2724), __webpack_require__.e(8867)]).then(__webpack_require__.bind(__webpack_require__, 8867)),
  "@remotion/effects/radial-progressive-pixelate": () => Promise.all(/* import() */[__webpack_require__.e(2724), __webpack_require__.e(2669)]).then(__webpack_require__.bind(__webpack_require__, 2669)),
  "@remotion/effects/scanlines": () => __webpack_require__.e(/* import() */ 5669).then(__webpack_require__.bind(__webpack_require__, 5669)),
  "@remotion/effects/speckle": () => __webpack_require__.e(/* import() */ 9432).then(__webpack_require__.bind(__webpack_require__, 9432)),
  "@remotion/effects/shatter": () => __webpack_require__.e(/* import() */ 8190).then(__webpack_require__.bind(__webpack_require__, 8190)),
  "@remotion/effects/shine": () => __webpack_require__.e(/* import() */ 9188).then(__webpack_require__.bind(__webpack_require__, 9188)),
  "@remotion/effects/shrinkwrap": () => __webpack_require__.e(/* import() */ 2208).then(__webpack_require__.bind(__webpack_require__, 2208)),
  "@remotion/effects/vignette": () => __webpack_require__.e(/* import() */ 1481).then(__webpack_require__.bind(__webpack_require__, 1481)),
  "@remotion/effects/lightning": () => __webpack_require__.e(/* import() */ 2392).then(__webpack_require__.bind(__webpack_require__, 2392)),
  "@remotion/effects/rain-fall": () => Promise.all(/* import() */[__webpack_require__.e(8013), __webpack_require__.e(5857)]).then(__webpack_require__.bind(__webpack_require__, 5857)),
  "@remotion/effects/snow-fall": () => Promise.all(/* import() */[__webpack_require__.e(8013), __webpack_require__.e(3116)]).then(__webpack_require__.bind(__webpack_require__, 3116)),
  "@remotion/effects/fractal-noise": () => __webpack_require__.e(/* import() */ 6831).then(__webpack_require__.bind(__webpack_require__, 6831)),
  "@remotion/effects/contour-lines": () => __webpack_require__.e(/* import() */ 1537).then(__webpack_require__.bind(__webpack_require__, 1537)),
  "@remotion/effects/liquid-contours": () => __webpack_require__.e(/* import() */ 805).then(__webpack_require__.bind(__webpack_require__, 805)),
  "@remotion/effects/checkerboard": () => __webpack_require__.e(/* import() */ 8731).then(__webpack_require__.bind(__webpack_require__, 8731)),
  "@remotion/effects/flannel": () => __webpack_require__.e(/* import() */ 7649).then(__webpack_require__.bind(__webpack_require__, 7649)),
  "@remotion/effects/halftone-linear-gradient": () => __webpack_require__.e(/* import() */ 195).then(__webpack_require__.bind(__webpack_require__, 195)),
  "@remotion/effects/gridlines": () => __webpack_require__.e(/* import() */ 4759).then(__webpack_require__.bind(__webpack_require__, 4759)),
  "@remotion/effects/white-noise": () => __webpack_require__.e(/* import() */ 8739).then(__webpack_require__.bind(__webpack_require__, 8739)),
  "@remotion/effects/tv-signal-off": () => __webpack_require__.e(/* import() */ 9738).then(__webpack_require__.bind(__webpack_require__, 9738)),
  "@remotion/effects/lines": () => __webpack_require__.e(/* import() */ 716).then(__webpack_require__.bind(__webpack_require__, 716)),
  "@remotion/effects/rings": () => __webpack_require__.e(/* import() */ 2166).then(__webpack_require__.bind(__webpack_require__, 2166)),
  "@remotion/effects/waves": () => __webpack_require__.e(/* import() */ 3615).then(__webpack_require__.bind(__webpack_require__, 3615)),
  "@remotion/effects/zigzag": () => __webpack_require__.e(/* import() */ 7280).then(__webpack_require__.bind(__webpack_require__, 7280)),
  "@remotion/effects/light-leak": () => __webpack_require__.e(/* import() */ 756).then(__webpack_require__.bind(__webpack_require__, 756)),
  "@remotion/effects/starburst": () => __webpack_require__.e(/* import() */ 1550).then(__webpack_require__.bind(__webpack_require__, 1550))
};
if ( true && typeof __webpack_module__.hot?.accept === "function") {
  __webpack_module__.hot.accept();
}



/***/ }

}]);
//# sourceMappingURL=9414.bundle.js.map