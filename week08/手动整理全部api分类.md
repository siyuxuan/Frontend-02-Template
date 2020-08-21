#全部API的分类和整理
标准化组织
* khronos
    * WebGL
* ECMA
    * ECMAScript
* WHATWG
    * HTML  
* W3C
    * webaudio
    * CG/WG

## 1、首先获取windows上所有的属性名 

JavaScript 中规定的 API大部分的 API 属于 Window 对象（或者说全局对象），我们可以用反射来看一看现行浏览器中已经实现的 API，我这里使用 Mac 下的 chrome 84.0.4147.125 版本。

```ruby
let names =Object.getOwnPropertyNames(window)
```
我们首先调用 Object.getOwnPropertyNames(window)。在我的环境中，可以看到，共有 851 个属性。

## 2、 把JavaScript中所有的属性给过滤出来
```ruby
 {
          let js = new Set();
          let Objects = ["globalThis","console","BigInt", "BigInt64Array", "BigUint64Array", "Infinity", "NaN", "undefined", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function", "Boolean", "String", "Number", "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect", "escape", "unescape"];
          Objects.forEach(o => js.add(o));
          names = names.filter(e =>!js.has(e));
      }

```
这时候names.length =888

## 3、过滤掉node的子节点 来自于dom spi
```ruby
  names = names.filter(e => {
        try {
            return !(window[e].prototype instanceof Node)
        } catch (error) {
            return true;
        }
    }).filter(e => e != "Node");
```
## 4、过滤掉Events事件相关的属性

```ruby
    names = names.filter(e => !e.match(/^on/));
```

## 5、过滤掉webkit private 
参考：https://compat.spec.whatwg.org/
这个标准描述了web浏览器需要支持的非标准（通常带有供应商前缀）CSS属性和domapi的集合，以便与事实上的web兼容。

```ruby
    names = names.filter(e => !e.match(/^webkit/));
```

## 6、过滤HTML标准的window 
参考网站 https://html.spec.whatwg/#window
```ruby

{
    let names = Object.getOwnPropertyNames(window)
    let js = new Set();
    let objects = ["BigInt", "BigInt64Array", "BigUint64Array", "Infinity", "NaN", "undefined", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function", "Boolean", "String", "Number", "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect", "escape", "unescape"];
    objects.forEach(o => js.add(o));
    names = names.filter(e => !js.has(e));

    names = names.filter( e => {
        try { 
            return !(window[e].prototype instanceof Node)
        } catch(err) {
            return true;
        }
    }).filter( e => e != "Node")

    let windowprops = new Set();
    objects = ["window", "self", "document", "name", "location", "history", "customElements", "locationbar", "menubar", " personalbar", "scrollbars", "statusbar", "toolbar", "status", "close", "closed", "stop", "focus", " blur", "frames", "length", "top", "opener", "parent", "frameElement", "open", "navigator", "applicationCache", "alert", "confirm", "prompt", "print", "postMessage", "console"];
    objects.forEach(o => windowprops.add(o));
    names = names.filter(e => !windowprops.has(e));
}
```
## 7、我们在 whatwg 中的接口 Event
（https://html/spec.whatwg.org）
```ruby
{
    let interfaces = new Set();
    objects = ["ApplicationCache", "AudioTrack", "AudioTrackList", "BarProp", "BeforeUnloadEvent", "BroadcastChannel", "CanvasGradient", "CanvasPattern", "CanvasRenderingContext2D", "CloseEvent", "CustomElementRegistry", "DOMStringList", "DOMStringMap", "DataTransfer", "DataTransferItem", "DataTransferItemList", "DedicatedWorkerGlobalScope", "Document", "DragEvent", "ErrorEvent", "EventSource", "External", "FormDataEvent", "HTMLAllCollection", "HashChangeEvent", "History", "ImageBitmap", "ImageBitmapRenderingContext", "ImageData", "Location", "MediaError", "MessageChannel", "MessageEvent", "MessagePort", "MimeType", "MimeTypeArray", "Navigator", "OffscreenCanvas", "OffscreenCanvasRenderingContext2D", "PageTransitionEvent", "Path2D", "Plugin", "PluginArray", "PopStateEvent", "PromiseRejectionEvent", "RadioNodeList", "SharedWorker", "SharedWorkerGlobalScope", "Storage", "StorageEvent", "TextMetrics", "TextTrack", "TextTrackCue", "TextTrackCueList", "TextTrackList", "TimeRanges", "TrackEvent", "ValidityState", "VideoTrack", "VideoTrackList", "WebSocket", "Window", "Worker", "WorkerGlobalScope", "WorkerLocation", "WorkerNavigator","BeforeInstallPromptEvent","TransitionEvent", "TextEvent","BackgroundFetchManager", "BackgroundFetchRecord", "BackgroundFetchRegistration","TrustedHTML", "TrustedScript", "TrustedScriptURL", "TrustedTypePolicy", "TrustedTypePolicyFactory", "UserActivation", "AnimationPlaybackEvent"];
    objects.forEach(o => interfaces.add(o));

    names = names.filter(e => !interfaces.has(e));
}
```
## 8、Intl
它属于 ECMA402 标准，这份标准是 JavaScript 的一个扩展，它包含了国际化相关的内容（http://www.ecma-international.org/ecma-402/5.0/index.html#TitleECMA402）
中，只有一个全局属性 Intl，我们也把它过滤掉：
```ruby
names = names.filter(e => e != "Intl");
```
## 9、WebGLContext​Event
WebGL参考：https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14

This specification describes an additional rendering context and support objects for the HTML 5 canvas element [CANVAS]. This context allows rendering using an API that conforms closely to the OpenGL ES 2.0 API.
该规范描述了HTML5canvas元素[canvas]的附加呈现上下文和支持对象。此上下文允许使用与opengles2.0api非常一致的API进行渲染。

显然，这个属性来自 WebGL 标准：(https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15)我们在这份标准中找到了一些别的属性，我们把它一起过滤掉：
```ruby
names = filterOut(names, ["WebGLContextEvent","WebGLObject", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLTexture", "WebGLUniformLocation", "WebGLActiveInfo", "WebGLShaderPrecisionFormat", "WebGLRenderingContext","WebGLVertexArrayObject", "WebGLTransformFeedback", "WebGLSync", "WebGLSampler", "WebGLQuery", "WebGL2RenderingContext"]);
```
## 10、Web Audio API

下一个属性是 WaveShaperNode。这个属性名听起来就跟声音有关，这个属性来自 W3C 的 Web Audio API 标准。我们来看一下标准：（ https://www.w3.org/TR/webaudio/）

```ruby
 names = filterOut(names, ["AudioContext", "AudioNode", "AnalyserNode", "AudioBuffer", "AudioBufferSourceNode", "AudioDestinationNode", "AudioParam", "AudioListener", "AudioWorklet", "AudioWorkletGlobalScope", "AudioWorkletNode", "AudioWorkletProcessor", "BiquadFilterNode", "ChannelMergerNode", "ChannelSplitterNode", "ConstantSourceNode", "ConvolverNode", "DelayNode", "DynamicsCompressorNode", "GainNode", "IIRFilterNode", "MediaElementAudioSourceNode", "MediaStreamAudioSourceNode", "MediaStreamTrackAudioSourceNode", "MediaStreamAudioDestinationNode", "PannerNode", "PeriodicWave", "OscillatorNode", "StereoPannerNode", "WaveShaperNode", "ScriptProcessorNode", "AudioProcessingEvent", "AudioScheduledSourceNode", "AudioParamMap","BlobEvent"]);
```
## 11、Encoding 标准

在我的环境中，下一个属性是 TextEncoderStream，经过查阅得知，这个属性也来自一份 WHATWG 的标准，Encoding：(https://encoding.spec.whatwg.org/#dom-textencoder)这份标准仅仅包含四个接口，我们把它们过滤掉：
```ruby

names = filterOut(names, ["TextDecoder", "TextEncoder", "TextDecoderStream", "TextEncoderStream"]);
```

## 12、Web Background Synchronization
下一个属性是 SyncManager，这个属性比较特殊，它并没有被标准化，但是我们仍然可以找到它的来源文档：(https://wicg.github.io/BackgroundSync/spec/#sync-manager-interface)这个属性我们就不多说了，过滤掉就好了。

```ruby
names = filterOut(names, ["SyncManager", "PeriodicSyncManager"]);

```
## 13、Media Source Extensions
参考（https://w3c.github.io/media-source/）这份标准中包含了三个接口，分别为：

* SourceBufferList接口表示多个SourceBuffer对象的简单容器列表。

可以使用MediaSource检索包含附加到特定MediaSource的SourceBuffers的源缓冲区列表。sourceBuffers property。可以使用数组操作符(即[])或forEach()等函数访问单个源缓冲区。
* SourceBuffer接口表示要通过MediaSource对象传递到HTMLMediaElement并播放的媒体块。这可以由一个或几个媒体部分组成。

* MediaSource是Media Source Extensions API 表示媒体资源HTMLMediaElement对象的接口。MediaSource 对象可以附着在HTMLMediaElement在客户端进行播放。
```ruby
names = filterOut(names, ["MediaSource", "SourceBuffer", "SourceBufferList"])
```

## 14、The Screen Orientation API
https://w3c.github.io/screen-orientation/
* The ScreenOrientation interface of the the Screen Orientation API provides information about the current orientation of the document.

```ruby
names = names.filter(e => e!= "ScreenOrientation")
```

## 15、 WebRTC API
WebRTC API接口RTCTrackEvent表示跟踪事件，当一个新的MediaStreamTrack被添加到RTCPeerConnection的一部分RTCRtpReceiver中时发送该事件。目标是要向其添加跟踪的RTCPeerConnection对象。

此事件由WebRTC层发送到web站点或应用程序，因此您通常不需要自己实例化RTCTrackEvent。
```ruby
names = filterOut(names,["RTCTrackEvent", "RTCStatsReport", "RTCSessionDescription", "RTCSctpTransport", "RTCRtpTransceiver", "RTCRtpSender", "RTCRtpReceiver", "RTCPeerConnectionIceEvent", "RTCPeerConnectionIceErrorEvent", "RTCPeerConnection", "RTCIceCandidate", "RTCErrorEvent", "RTCError", "RTCDtlsTransport", "RTCDataChannelEvent", "RTCDataChannel", "RTCDTMFToneChangeEvent", "RTCDTMFSender", "RTCCertificate"])
```
## 15、Media Capture and Streams  ---- mediacapture-image
参考： https://w3c.github.io/mediacapture-image/
MediaStream图像捕获API的PhotoCapabilities接口为附加的照相设备提供了可用的配置选项。通过调用imagecapi . getphotocapabilities()来检索PhotoCapabilities对象。
`names = names.filter(e => e !="PhotoCapabilities")`
## 16 MediaStream API
The two main components in the MediaStream API are the MediaStreamTrack and MediaStream interfaces. The MediaStreamTrack object represents media of a single type that originates from one media source in the User Agent, e.g. video produced by a web camera. A MediaStream is used to group several MediaStreamTrack objects into one unit that can be recorded or rendered in a media element.
* MediaStreamEvent 接口表示发生在 MediaStream中的事件.这种类型返回两个事件: addstream 和 removestream.
* MediaStreamTrackEvent The MediaStreamTrackEvent() constructor returns a newly created MediaStreamTrackEvent object, which represents an event announcing that a MediaStreamTrack has been added to or removed from a MediaStream.

``` ruby
names = filterOut(names,["MediaStreamTrack","MediaStream","MediaStreamEvent","MediaStreamTrackEvent","MediaSettingsRange", "MediaRecorder", "MediaEncryptedEvent", "MediaCapabilities","ImageCapture","InputDeviceInfo","captureEvents"])
```

## 17、IndexedDB API
参考：https://w3c.github.io/webrtc-pc/#idl-def-MediaStreamEvent
IndexedDB是一个底层API，用于客户端存储大量的结构化数据，包括文件/blob。这个API使用索引来支持对该数据的高性能搜索。虽然Web存储对于存储较小数量的数据很有用，但对于存储较大数量的结构化数据就不那么有用了。IndexedDB提供了一个解决方案。这是MDN的IndexedDB覆盖的主要登陆页——这里我们提供了完整的API参考和使用指南的链接，浏览器支持细节，以及一些关键概念的解释。
``` ruby
names = filterOut(names,["IDBVersionChangeEvent", "IDBTransaction", "IDBRequest", "IDBOpenDBRequest", "IDBObjectStore", "IDBKeyRange", "IDBIndex", "IDBFactory", "IDBDatabase", "IDBCursorWithValue", "IDBCursor"])
```

## 18、Web Audio API
>1、BaseAudioContext

此接口表示一组AudioNode对象及其连接。它允许信号的任意路由到一个AudioDestinationNode。节点是根据上下文创建的，然后连接在一起。
BaseAudioContext不是直接实例化的，而是由具体接口AudioContext(用于实时渲染)和OfflineAudioContext(用于离线渲染)扩展的。

>2、AudioContext

AudioContext接口表示由链接在一起的音频模块构建的音频处理图，每个模块由一个AudioNode表示。音频上下文控制它包含的节点的创建和音频处理或解码的执行。在做任何其他操作之前，您需要创建一个AudioContext对象，因为所有事情都是在上下文中发生的。建议创建一个AudioContext对象并复用它，而不是每次初始化一个新的AudioContext对象，并且可以对多个不同的音频源和管道同时使用一个AudioContext对象。

![week08](img/01.png "AudioContext")

>3、OfflineAudioContext

OfflineAudioContext是BaseAudioContext的一种特殊类型，用于渲染/混合(可能)快于实时。它不渲染到音频硬件，而是尽可能快地渲染，以AudioBuffer的形式来实现返回的承诺。

>4、 AudioBuffer

此接口表示驻留在内存中的音频资产。它可以包含一个或多个通道，每个通道看起来都是32位浮点线性PCM值，其标称范围为[−1,1]，但这些值并不局限于此范围。通常，PCM数据的长度应该相当短(通常小于一分钟)。对于较长的声音，比如音乐原声，流媒体应该与audio元素和MediaElementAudioSourceNode一起使用。
一个AudioBuffer可以被一个或多个AudioContexts使用，并且可以在一个OfflineAudioContext和一个AudioContext之间共享。

AudioBuffer has four internal slots:

* [[number of channels]]
    The number of audio channels for this AudioBuffer, which is an unsigned long.

* [[length]]
    The length of each channel of this AudioBuffer, which is an unsigned long.

* [[sample rate]]
    The sample-rate, in Hz, of this AudioBuffer, a float.

* [[internal data]]
    A data block holding the audio sample data.

>4、The AudioNode Interface

audionode是AudioContext的构建模块。此接口表示音频源、音频目的地和中间处理模块。这些模块可以连接在一起形成处理图形，以便将音频呈现给音频硬件。每个节点都可以有输入和/或输出。源节点没有输入，只有一个输出。大多数处理节点(如过滤器)都有一个输入和一个输出。每一种音频在处理和合成音频的细节上都是不同的。但是，通常，AudioNode会处理它的输入(如果它有的话)，并为它的输出生成音频(如果它有的话)。

>6、The AudioParam Interface

>7、The AudioScheduledSourceNode Interface

还有好多就不再这里一一列举了。

```ruby
names = filterOut(names,["BaseAudioContext","OfflineAudioContext", "OfflineAudioCompletionEvent"])
```

## 19 UIEvent
参考：https://w3c.github.io/uievents/
这个规范定义了扩展[DOM]中定义的DOM事件对象的UI事件。UI事件通常是由可视化用户代理实现的，用于处理用户交互，如鼠标和键盘输入
```ruby
names = filterOut(names,["InputEvent","InputDeviceCapabilities","focus","FocusEvent","blur", "MouseEvent","MouseEvent", "KeyframeEffect", "KeyboardEvent","WheelEvent",, "Keyboard", "KeyboardLayoutMap","UIEvent"])
```

## 20、geolocation-api
参考：https://w3c.github.io/geolocation-api/
This specification defines an API that provides scripted access to geographical location information associated with the hosting device.
```ruby
names = filterOut(names,["GeolocationPositionError", "GeolocationPosition", "GeolocationCoordinates", "Geolocation"])
```

## 21、Gamepad API
参考https://w3c.github.io/gamepad/extensions.html
扩展基本手柄规范，使访问更先进的设备功能
```ruby
names = filterOut(names,[ "GamepadHapticActuator", "GamepadEvent", "Gamepad", "GamepadButton"])
```

## 21、svg
参考https://www.w3.org/TR/SVG11/coords.html

For all media, the SVG canvas describes "the space where the SVG content is rendered." The canvas is infinite for each dimension of the space, but rendering occurs relative to a finite rectangular region of the canvas. This finite rectangular region is called the SVG viewport. For visual media ([CSS2], section 7.3.1) the SVG viewport is the viewing area where the user sees the SVG content.

```ruby
names = filterOut(names,["SVGUnitTypes", "SVGTransformList", "SVGTransform", "SVGStringList", "SVGRect", "SVGPreserveAspectRatio", "SVGPointList", "SVGPoint", "SVGNumberList", "SVGNumber", "SVGMatrix", "SVGLengthList", "SVGLength", "SVGAnimatedTransformList", "SVGAnimatedString", "SVGAnimatedRect", "SVGAnimatedPreserveAspectRatio", "SVGAnimatedNumberList", "SVGAnimatedNumber", "SVGAnimatedLengthList", "SVGAnimatedLength", "SVGAnimatedInteger", "SVGAnimatedEnumeration", "SVGAnimatedBoolean", "SVGAnimatedAngle", "SVGAngle"])
```

## 22、Web MIDI API

该规范定义了一个支持MIDI协议的API，使web应用程序能够枚举和选择客户端系统上的MIDI输入和输出设备，并发送和接收MIDI消息。它旨在通过提供对用户系统上可用的MIDI设备的低级访问来支持非音乐的MIDI应用程序和音乐应用程序。Web MIDI API不是用来语义地描述音乐或控制器输入的;它的目的是揭露MIDI输入和输出接口的机制,以及发送和接收的实际方面的MIDI消息,没有识别这些行为意味着什么语义(例如,用“调节20赫兹的颤音”或“发挥G # 7和弦”,除了改变控制器的值或发送一组关于消息,发生在代表G # 7和弦)。

```ruby
names = filterOut(names,["MIDIAccess", "MIDIConnectionEvent", "MIDIInput", "MIDIInputMap", "MIDIMessageEvent", "MIDIOutput", "MIDIOutputMap", "MIDIPort"])
```

## 24、  webusb

参考:https://wicg.github.io/webusb/

This document describes an API for securely providing access to Universal Serial Bus devices from web pages.

```ruby
names = filterOut(names,[ "USB", "USBAlternateInterface", "USBConfiguration", "USBConnectionEvent", "USBDevice", "USBEndpoint", "USBInterface", "USBInTransferResult", "USBIsochronousInTransferPacket", "USBIsochronousInTransferResult", "USBIsochronousOutTransferPacket", "USBIsochronousOutTransferResult", "USBOutTransferResult"])
```
## 25 、touch-events
参考：https://www.w3.org/TR/touch-events/

 ```ruby
names = filterOut(names,[ "TouchList", "TouchEvent", "Touch"])
```
## 26 DOMTokenList
参考：https://dom.spec.whatwg.org/
* Interface DOMTokenList
    ```ruby
    [Exposed=Window]
    interface DOMTokenList {
    readonly attribute unsigned long length;
    getter DOMString? item(unsigned long index);
    boolean contains(DOMString token);
    [CEReactions] undefined add(DOMString... tokens);
    [CEReactions] undefined remove(DOMString... tokens);
    [CEReactions] boolean toggle(DOMString token, optional boolean force);
    [CEReactions] boolean replace(DOMString token, DOMString newToken);
    boolean supports(DOMString token);
    [CEReactions] stringifier attribute DOMString value;
    iterable<DOMString>;
    };
    ```
* The canvas element


 ```ruby
{names = filterOut(names,["DOMTokenList","DOMRectReadOnly","DOMRectList","DOMRect","DOMQuad","DOMPointReadOnly","DOMPoint","DOMParser","DOMMatrixReadOnly","DOMMatrix","DOMImplementation","DOMException","CanvasCaptureMediaStreamTrack","DOMError"])}
```
## 27 dom-css
参考：https://drafts.css-houdini.org/css-typed-om-1/
 ```ruby
names = filterOut(names,["CSSVariableReferenceValue", "CSSUnparsedValue", "CSSUnitValue", "CSSTranslate", "CSSTransformValue", "CSSTransformComponent", "CSSSupportsRule", "CSSStyleValue", "CSSStyleSheet", "CSSStyleRule", "CSSStyleDeclaration", "CSSSkewY", "CSSSkewX", "CSSSkew"
,"CSSScale", "CSSRuleList", "CSSRule", "CSSRotate", "CSSPositionValue", "CSSPerspective", "CSSPageRule", "CSSNumericValue", "CSSNumericArray", "CSSNamespaceRule", "CSSMediaRule", "CSSMatrixComponent", "CSSMathValue", "CSSMathSum", "CSSMathProduct", "CSSMathNegate", "CSSMathMin", "CSSMathMax", "CSSMathInvert", "CSSKeywordValue", "CSSKeyframesRule", "CSSKeyframeRule", "CSSImportRule", "CSSImageValue", "CSSGroupingRule", "CSSFontFaceRule", "CSS", "CSSConditionRule"])
```
## 28 WebXR Device API
参考：https://immersive-web.github.io/webxr/#dom-xrframe-session

The session attribute returns the XRSession that produced the XRFrame.
session属性返回生成XRFrame的XRSession。
 ```ruby
{names = filterOut(names,["XRFrame", "XRInputSource", "XRInputSourceArray", "XRInputSourceEvent", "XRInputSourcesChangeEvent", "XRPose", "XRReferenceSpace", "XRReferenceSpaceEvent", "XRRenderState", "XRRigidTransform", "XRSession", "XRSessionEvent", "XRSpace", "XRSystem", "XRView", "XRViewerPose", "XRViewport", "XRWebGLLayer", "XRHitTestResult", "XRHitTestSource", "XRRay", "XRTransientInputHitTestResult", "XRTransientInputHitTestSource" , "XRBoundedReferenceSpace","XRDOMOverlayState","XRLayer"])}
```
## 29、 StyleSheet
参考：https://www.w3.org/TR/DOM-Level-2-Style/stylesheets.html

 ```ruby
{names = filterOut(names,["StyleSheetList", "StyleSheet", "StylePropertyMapReadOnly", "StylePropertyMap"])}
```
## 30、 Media Capture and Streams ----Error Handling
参考：https://w3c.github.io/mediacapture-main/
本节及其子节扩展了[ECMA-262]中定义的错误子类列表，遵循该规范第19.5.6节中NativeError的模式。假设如下：

像[[something]]和%something%这样的语法用法与[ECMA-262]中使用的一样。

ECMAScript标准内置对象的规则（[ECMA-262]，第17节）在本节中有效。

新的内部对象%OverconstrainedError%和%OverconstrainedErrorPrototype%都是可用的，就好像它们已经包含在（[ECMA-262]，表7）和所有引用部分（例如，[ECMA-262]，第8.2.2节）中一样，因此行为适当。

 ```ruby
{names = filterOut(names,["OverconstrainedError", "navigator","MediaDeviceInfo", "MediaDevices", "MediaKeyMessageEvent", "MediaKeys", "MediaKeySession", "MediaKeyStatusMap", "MediaKeySystemAccess",])}
```

## 31、Network Information API
参考：https://wicg.github.io/netinfo/#networkinformation-interface
网络信息API使web应用程序能够访问有关设备使用的网络连接的信息。


 ```ruby
{names = filterOut(names,["NetworkInformation"])}
```

## 32、Readable streams
参考：https://streams.spec.whatwg.org/#rs-constructor

The simplest way to consume a readable stream is to simply pipe it to a writable stream. This ensures that backpressure is respected, and any errors (either writing or reading) are propagated through the chain:
```ruby
readableStream.pipeTo(writableStream)
  .then(() => console.log("All data successfully written!"))
  .catch(e => console.error("Something went wrong!", e));
```
过滤阅读流：
 ```ruby
{names = filterOut(names,["DecompressionStream", "ReadableStreamDefaultReader", "ReadableStream"])}
```

## 33 WebGL Specification
参考：https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14

This specification describes an additional rendering context and support objects for the HTML 5 canvas element [CANVAS]. This context allows rendering using an API that conforms closely to the OpenGL ES 2.0 API.
该规范描述了HTML5canvas元素[canvas]的附加呈现上下文和支持对象。此上下文允许使用与opengles2.0api非常一致的API进行渲染。

 ```ruby
{names = filterOut(names,["DecompressionStream", "ReadableStreamDefaultReader", "ReadableStream","CompressionStream","WritableStreamDefaultWriter", "WritableStream" "TransformStream"])}
```

## 34、Web Cryptography API
参考：https://www.w3.org/TR/WebCryptoAPI/#crypto-interface

本规范描述了一个JavaScript API，用于在web应用程序中执行基本的加密操作，例如散列、签名生成和验证以及加密和解密。此外，它描述了一个应用程序API，用于生成和/或管理执行这些操作所需的键控材料。此API的用途包括用户或服务身份验证、文档或代码签名以及通信的机密性和完整性。

 ```ruby
 {names = filterOut(names,["Crypto","CryptoKey","PublicKeyCredential","AuthenticatorAssertionResponse","AuthenticatorAttestationResponse","AuthenticatorResponse","SubtleCrypto","PasswordCredential","Credential","CredentialsContainer"])}
``` 

## 35、Clipboard API and events
参考：https://w3c.github.io/clipboard-apis/#clipboarditem

本文档描述访问系统剪贴板上数据的API。它提供覆盖默认剪贴板操作（剪切、复制和粘贴）以及直接访问剪贴板内容的操作。

 ```ruby
{names = filterOut(names,["ClipboardItem","Clipboard"])}
```

## 36 Web APIs
参考：https://developer.mozilla.org/en-US/docs/Web/API

当为Web编写代码时，有大量的webapi可用。下面是开发Web应用程序或网站时可能使用的所有API和接口（对象类型）的列表。

webapi通常与JavaScript一起使用，但并不一定总是这样。
 ```ruby
{names = filterOut(names,["BeforeInstallPromptEvent", "BatteryManager", "XPathResult", "XPathExpression", "XPathEvaluator", "XMLSerializer", "XMLHttpRequestUpload", "XMLHttpRequestEventTarget", "XMLHttpRequest", "VisualViewport", "VTTCue", "URLSearchParams", "URL", "TreeWalker", "TransitionEvent", "TextEvent", "TaskAttributionTiming", "SubmitEvent", "StaticRange", "Selection", "SecurityPolicyViolationEvent", "Screen", "Response", "ResizeObserverEntry", "ResizeObserver", "Request", "ReportingObserver", "Range", "ProgressEvent", "PointerEvent", "PerformanceTiming", "PerformanceServerTiming", "PerformanceResourceTiming", "PerformancePaintTiming", "PerformanceObserverEntryList", "PerformanceObserver", "PerformanceNavigationTiming", "PerformanceNavigation", "PerformanceMeasure", "PerformanceMark", "PerformanceLongTaskTiming", "PerformanceEventTiming", "PerformanceEntry", "PerformanceElementTiming", "Performance", "NodeList", "NodeIterator", "NodeFilter", "NamedNodeMap", "MutationRecord", "MutationObserver", "MutationEvent", "MediaQueryListEvent", "MediaQueryList", "MediaList", "LayoutShift", "LargestContentfulPaint", "IntersectionObserverEntry", "IntersectionObserver", "IdleDeadline", "Headers", "HTMLOptionsCollection", "HTMLFormControlsCollection", "HTMLCollection", "FormData", "FontFaceSetLoadEvent", "FontFace", "FileReader", "FileList", "File", "EventTarget", "Event", "ElementInternals", "CustomEvent", "CountQueuingStrategy", "CompositionEvent", "ClipboardEvent", "ByteLengthQueuingStrategy", "Blob", "AnimationEvent", "AnimationEffect", "Animation","AbortSignal", "AbortController", "WebKitCSSMatrix", "WebKitMutationObserver","event"])}
```
## 37. Web Bluetooth
参考：https://webbluetoothcg.github.io/web-bluetooth/#bluetoothdevice
本文档描述了一个API，用于使用通用属性配置文件（GATT）通过蓝牙4无线标准发现和通信设备。
```ruby
{names = filterOut(names,["Bluetooth", "BluetoothCharacteristicProperties", "BluetoothDevice", "BluetoothRemoteGATTCharacteristic", "BluetoothRemoteGATTDescriptor", "BluetoothRemoteGATTServer", "BluetoothRemoteGATTService","BluetoothUUID"])}
```
## 38. DeviceOrientation Event Specification

参考：https://w3c.github.io/deviceorientation

这个规范定义了几个新的DOM事件，这些事件提供了有关宿主设备的物理方向和运动的信息。

```ruby
{names = filterOut(names,["DeviceMotionEvent", "DeviceMotionEventAcceleration", "DeviceMotionEventRotationRate", "DeviceOrientationEvent"])}
```

## 39.Payment Request API

参考：https://w3c.github.io/payment-request/#paymentmethodchangeevent-interface

本规范对API进行了标准化，允许商家（即销售实物或数字商品的网站）使用一种或多种支付方式，且集成度最低。用户代理（如浏览器）促进了商家和用户之间的支付流程。

```ruby
{names = filterOut(names,["PaymentMethodChangeEvent", "PaymentAddress", "PaymentRequest", "PaymentResponse", "Presentation", "PresentationAvailability", "PresentationConnection", "PresentationConnectionAvailableEvent", "PresentationConnectionCloseEvent", "PresentationConnectionList", "PresentationReceiver", "PresentationRequest"])}
```

## 40. Media Playback Quality

参考网站：https://w3c.github.io/media-playback-quality/#idl-def-videoplaybackquality

这个规范扩展了HTMLVideoElement来添加新的特性，这些特性可以用来检测用户感知到的播放质量。

```ruby
{names = filterOut(names,["VideoPlaybackQuality"])}
```
## 41.Service Workers Nightly
参考网站：https://w3c.github.io/ServiceWorker/

此规范的核心是唤醒以接收事件的工作线程。这提供了一个事件目的地，当其他目的地不合适或不存在其他目的地时，可以使用该目的地。

    例如，为了允许开发人员决定如何获取页面，需要在该源存在任何其他执行上下文之前调度事件。要对推送消息作出反应，或完成持久下载，最初注册兴趣的上下文可能不再存在。在这些情况下，服务人员是理想的事件目的地。

该规范还提供了一个fetch事件，以及一个与HTTP缓存设计类似的请求和响应存储，这使得构建支持脱机的web应用程序更容易。
```ruby
{names = filterOut(names,["ServiceWorker", "ServiceWorkerContainer", "ServiceWorkerRegistration"])}
```
## 42.Generic Sensor API

参考：https://www.w3.org/TR/generic-sensor/#the-sensor-interface

本规范定义了一个框架，用于以一致的方式向开放式Web平台公开传感器数据。它通过定义一个蓝图来编写具体传感器的规范，以及一个抽象的传感器接口来实现，该接口可以扩展以适应不同的传感器类型。

```ruby
{names = filterOut(names,["Sensor","SensorErrorEvent","Accelerometer", "OrientationSensor","RelativeOrientationSensor", "AbsoluteOrientationSensor","Gyroscope","LinearAccelerationSensor"])}
```
## 43.storagemanager
参考：https://storage.spec.whatwg.org/#storagemanager

Each environment settings object has an associated StorageManager object.

```ruby
{names = filterOut(names,["StorageManager","sessionStorage", "localStorage","caches","Cache","CacheStorage"])}
```
## 44.storagemanager
参考：https://w3c.github.io/webrtc-pc/#dom-rtcicetransport

RTCIceTransport接口允许应用程序访问有关发送和接收数据包的ICE传输的信息。特别是，ICE管理涉及应用程序可能想要访问的状态的对等连接。RTiceTransport对象是通过调用setLocalDescription（）和setRemoteDescription（）来构造的。底层ICE状态由ICE代理管理；因此，当ICE代理向用户代理提供指示时，rticetransport的状态将发生变化，如下所述。每个rticetransport对象代表特定RTCRtpTransceiver的RTP或RTCP组件的ICE传输层，或者一组RTCRtpTransceiver（如果通过[BUNDLE]协商了这样一个组）。

```ruby
{names = filterOut(names,["RTCIceTransport"])}
```
## 45 Service Workers Nightly
参考网站：https://w3c.github.io/ServiceWorker/#navigation-preload-manager

服务工作者是web工作者的一种类型。服务工作线程在注册服务工作线程客户端的源中执行。

服务工作者有一个关联的状态，它是“已解析”、“正在安装”、“已安装”、“正在激活”、“已激活”和“冗余”之一。它最初是“解析”的。

```ruby
{names = filterOut(names,["NavigationPreloadManager"])}
```
## 46 Web Locks API
参考：https://wicg.github.io/web-locks/#api-lock

锁定请求是由脚本针对特定的资源名称和模式发出的。调度算法查看当前和以前请求的状态，并最终授予锁请求。锁是一个被授权的请求；它有一个资源名称和模式。它表示为返回到脚本的对象。只要锁定被持有，它就可能阻止其他锁请求被授予（取决于名称和模式）。一个锁可以通过脚本释放，这时它可以允许其他锁请求被授予。

The API provides optional functionality that may be used as needed, including:

* returning values from the asynchronous task,

* shared and exclusive lock modes,

* conditional acquisition,

* diagnostics to query the state of locks in an origin, and

* an escape hatch to protect against deadlocks.


```ruby
{names = filterOut(names,["Lock","LockManager"])}
```
## 47.Web Speech API
参考：https://wicg.github.io/speech-api/

该规范定义了一个JavaScript API，使web开发人员能够将语音识别和合成功能集成到他们的web页面中。它使开发人员能够使用脚本生成文本到语音输出，并使用语音识别作为表单、连续听写和控制的输入。JavaScript API允许web页面控制激活和计时，并处理结果和备选方案。
```ruby
{names = filterOut(names,["SpeechSynthesisErrorEvent", "SpeechSynthesisEvent", "SpeechSynthesisUtterance", "speechSynthesis"])}
```

## 48. Worklets
参考：https://drafts.css-houdini.org/worklets/#worklet

此规范定义了一个API，用于在渲染管道的各个阶段运行脚本，而不依赖于主javascript执行环境。

```ruby
{names = filterOut(names,["Worklet"])}
```
## 49. Push API
参考：https://w3c.github.io/push-api/#pushmanager-interface

此规范定义了一个API，用于在渲染管道的各个阶段运行脚本，而不依赖于主javascript执行环境。

The PushManager interface defines the operations to access push services.

```ruby
{names = filterOut(names,["PushManager", "PushSubscription", "PushSubscriptionOptions"])}
```

## 50. Payment Request API
参考：https://w3c.github.io/payment-request/#paymentrequest-interface

本规范对API进行了标准化，允许商家（即销售实物或数字商品的网站）使用一种或多种支付方式，且集成度最低。用户代理（如浏览器）促进了商家和用户之间的支付流程。

```ruby
{names = filterOut(names,["PaymentInstruments", "PaymentManager", "PaymentRequestUpdateEvent"])}
```
## 51. Browser Extensions
参考：https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions

```ruby
{names = filterOut(names,["Permissions", "PermissionStatus"])}
```
## 52 XMLHttpRequest
参考：https://xhr.spec.whatwg.org/

The XMLHttpRequest Standard defines an API that provides scripted client functionality for transferring data between a client and a server.

```ruby
{names = filterOut(names,["Permissions", "PermissionStatus"])}
```
## 52 Screen Wake Lock API

参考: https://w3c.github.io/screen-wake-lock/#the-wakelock-interface

本文档指定了一个API，允许web应用程序请求屏幕唤醒锁。在正确的条件下，如果允许，屏幕唤醒锁定会阻止系统关闭设备的屏幕。
```ruby
{names = filterOut(names,["WakeLock", "WakeLockSentinel"])}
```
## 53 Media Session Standard

参考: https://w3c.github.io/mediasession/#the-mediametadata-interface

此规范使web开发人员能够在平台UI上显示自定义的媒体元数据，自定义可用的平台媒体控件，并访问平台媒体密钥，如键盘、耳机、遥控器上的硬件密钥，以及通知区域和移动设备锁屏上的软件密钥。

```ruby
{names = filterOut(names,["MediaMetadata", "MediaSession"])}
```