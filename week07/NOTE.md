# 1、 css 排版
> 1. float 与 clear

> 2. margin折叠
    只会发生在正常流的BFC中
>3. 
Block Container：里面有BFC的 
 * 能容纳正常流的盒，里面就有BFC，想想有哪些？ 
    • block
    • inline-block
    • table-cell
    • flex item
    • grid cell
    • table-caption
 * Block-level Box：外面有BFC的 
 * Block Box = Block Container + Block-level Box：
    里外都有BFC的

 > 4. BFC合并
• block box && overflow:visible
• BFC合并与float
• BFC合并与边距折叠