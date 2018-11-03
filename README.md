jSignature
============

|Author|evan.fu|
|---|---
|E-mail|153668770@qq.com

---

## script
```javascript
mySignature = new jSignature('signature_1', {
    btnStart: '#btnStart',
    btnEnd: 'btnEnd',
    lineColor: '#000000',
    lineWidth: 2,
    background: '#FFFFFF',
    onStart:function(data){
        console.log('onStart');
    },
    onMove : function(data){
        console.log('onMove');
        //console.log(data);
    },
    onEnd : function(data){
        console.log('onEnd');
        var img = document.createElement('img');
        img.src = data;
        img.style.border = '5px #ff0000 solid';
        document.body.appendChild(img);
    }
});
``` 

## Example
1. [Demo](https://awin8516.github.io/jSignature/docs/)  