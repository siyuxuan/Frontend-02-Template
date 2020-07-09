week02 学习笔记


<Number> = "0" | "1" | "2" .....| "9"
<DecimalNumber> = "0" | (("1" | "2" .....| "9") <Number>* ) 
括号
 
BNF:
<AdditiveExpression> = <DecimalNumber> | <AdditiveExpression> "+" <DecimalNumber> 

产生式
四则运算
 1+ 2 * 3 

终结符
    Number
    + - * /
非终结符
    MultiplicativeExpression
    AdditiveExpression

括号
<PrimaryExpression> = <DecimalNumber> |
                        "(" <LogicalExpress> ")"

+ -
<AdditiveExpression> = <PrimaryExpression> | 
                      <AdditiveExpression> "+" <PrimaryExpression> | 
                      <AdditiveExpression> "-" <PrimaryExpression> 
                      
* /
<MultiplicativeExpression> = <DecimalNumber> | 
                        <MultiplicativeExpression> "*" <DecimalNumber> |
                        <MultiplicativeExpression> "/" <DecimalNumber>


  <LogicalExpress> = <DecimalNumber> | 
                     <LogicalExpress> "||" <AdditiveExpression> | 
                     <LogicalExpress> "&&" <AdditiveExpression>


通过产生式理解乔姆斯基谱系

 0型无限制文法
    ？:: =?  <a> <b> ::= "c" <d>
  
 1型上下文相关法 VB JavaScript Python 
    ?<A> ?::=? <B> ?  <a> <b> <c> ::= <a> "c" <b> 只有中间那个可以变
     "'''四则运算\n" <LogicalExpress> "'''" = "'''四则运算" (  <LogicalExpress> = <DecimalNumber> | 
                                                            <LogicalExpress> "||" <AdditiveExpression> | 
                                                            <LogicalExpress> "&&" <AdditiveExpression>) "'''" 
  


 2型上下文无关法             
<A>::=?


 3型正则文法（表达式）
    <A>::=<A>?
    <A>::=?<A> 不正确

    <DecimalNumber> = "0" | (("1" | "2" .....| "9") <Number>* ) 
    10进制整数
    <DecimalNumber> = /0|[1-9][0-9]*/

    {
        get a{ return1},
        get:1
    }
    属于1型文法

    2** 1**1 2型文法

    图灵完备性 
        命令式 -图灵机
            goto
            if和while
        声明式 -lambda
            递归

    动态与静态
        动态：
            在用户的设备/在线上服务器上
            产品运行时
            Runtime
        静态
            在程序员的设备上
            产品开发时
            Compiletime
    类型系统
        动态类型系统与静态类型系统
        强类型与弱类型
            String + Number 
            String == Boolean
        复合类型
            结构体  {a:T1,b:T2}
            函数签名 (T1,T2) =>T3
        子类型(C++) 
        泛型      把类型到做参数一样的东西传递给我们某段代码结构   凡是能用Array<Parent> 的地方都能用Array<Child>  凡是能用Funtion<Child> 的地方都能用Funtion<Parent> 
            逆变与协变

语言的分类
形式语言-用途
    数据描述语言 JSON 、HTML、XAML、SQL、CSS 
    编程语言    C++、C、Java、C#、Python、Ruby、Perl、Lisp、T-SQL、Clojure、Haskel、JavaScript
形式语言 -表达方式
    声明式语言  JSON 、HTML、XAML、SQL、CSS 、Lisp、Clojure、Haskel
    命令型语言  C++、C、Java、C#、Python、Ruby、Perl、T-SQL、JavaScript

一般命令式编程语言的设计方式

Atom(原子级) 最小的组成单位  通常包含关键字 直接量 变量名一些基本的单位称为原子
    Indetifier 变量名
    Literal 直接量 数字直接量和字符串直接量
Expression（表达式） 原子级的结构通过运算符相连接，加上一些辅助的符号，构成表达式，通常是一个可以级联的结构
    Atom 原子
    Operator 运算符 （javascript为例）
        算数运算符 + - * / % ++ --
        赋值运算符 = += -+ *= /= %=
        比较运算符 == === != !== > < >= <= ?
        逻辑运算符  && || !
        类型运算符 typeof(返回变量的类型) instanceof(返回 true，如果对象是对象类型的实例。)
        位运算符   & | ~(非) ^(异或) <<(零填充左位移) >>(有符号右位移)  >>> (零填充右位移)
    Punctuator 特定的符号

Statement语句  if while for 语句
    Expression
    Keyworld
    Punctuator

Structure结构化
    Function 
    Class
    Process 线程
    Namespace （c++）

Program工程 npm
    Promgram
    Module
    Package
    Library
