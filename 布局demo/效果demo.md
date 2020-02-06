## 导航滑动透明度变化

- 思路

  1. 获取渐变区域的高度（如轮播图的高度）。

     ```js
     const bannerY = document.getElementsByClassName('banner_img')[0].offsetHeight;
     ```

  2. 获取导航条元素

     ```js
     const nav = document.getElementsByClassName('nav')[0];
     ```

  3. 添加滚动监听，区域内的透明度 = 当前的滑动的高度/总高度

     ```js
     window.onscroll = function () {
         ...
     }
     ```

     

- 代码实现

  ```js
  const bannerY = document.getElementsByClassName('banner_img')[0].offsetHeight;
  const nav = document.getElementsByClassName('nav')[0];
  window.onscroll = function () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      console.log(scrollTop);
      if (scrollTop < bannerY) {
          let opacity = scrollTop / bannerY;
          nav.style.backgroundColor = `rgb(153, 26, 26, ${opacity})`;
      } else {
          nav.style.backgroundColor = "rgb(153, 26, 26, 1)";
      }
  }
  ```

  

