<<<<<<< HEAD
# CSS选择器 -选择器优先级
关于CSS优先级问题，我通过查阅CSS3文档 (https://www.w3.org/TR/selectors-3/#class-html) 中的有关优先级的介绍 

## 1 A selector's specificity is calculated as follows：
* count the number of ID selectors in the selector (= a) *计算选择器中ID选择器的数量（=a）*
* count the number of class selectors, attributes selectors, and pseudo-classes in the selector (= b) *计算选择器中的类选择器、属性选择器和伪类的数量（=b）*
* count the number of type selectors and pseudo-elements in the selector (= c) *计算选择器中类型选择器和伪元素的数量（=c）*
* ignore the universal selector

Concatenating the three numbers a-b-c (in a number system with a large base) gives the specificity.
> Example :
                *               /* a=0 b=0 c=0 -> specificity =   0 */
                LI              /* a=0 b=0 c=1 -> specificity =   1 */
                UL LI           /* a=0 b=0 c=2 -> specificity =   2 */
                UL OL+LI        /* a=0 b=0 c=3 -> specificity =   3 */
                H1 + *[REL=up]  /* a=0 b=1 c=1 -> specificity =  11 */
                UL OL LI.red    /* a=0 b=1 c=3 -> specificity =  13 */
                LI.red.level    /* a=0 b=2 c=1 -> specificity =  21 */
                #x34y           /* a=1 b=0 c=0 -> specificity = 100 */
                #s12:not(FOO)   /* a=1 b=0 c=1 -> specificity = 101 */

 *CSS :not伪类可能错误的认识* 参考<https://www.zhangxinxu.com/wordpress/2019/07/css-not-pseudo-class/>
=======
06学习笔记
>>>>>>> bd184f678b28d01651f694de7281e954902454fa
