<?php
$a=5; //控制循环的行数
$str = "*"; //输出显示字符
$space = "&nbsp;"; //输出空格字符
//以上是已基本设定
for($i=1;$i<=$a;$i++){ //$b代表空格数目
    for($b=1;$b<=$a-$i;$b++){ //控制输出的空格数 
        echo $space; 
    } //$c代表输出字符数目 
    for($c=1;$c<=($i-1)*2+1;$c++){ //控制输出的字符数目
        echo $str;
    }
echo "";
} //上面的循环负责菱形的上半部分，下面的循环负责菱形的下半部分
for($i=$a-1;$i>=1;$i--){ //$b代表空格数目
    for($b=1;$b<=$a-$i;$b++){//控制输出的空格数
        echo $space; 
    }//$c代表输出字符数目
    for($c=1;$c<=($i-1)*2+1;$c++){
        echo $str; 
    } 
echo ""; 
}