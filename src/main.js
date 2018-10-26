import $ from 'jquery'
import css from './css/index.css'
import less from './less/index.less'
import scss from './sass/index.scss'


const fn = () => {
    console.log("11111")
    console.log('环境', process.env)
    console.log('yzq', process.env.yzq)
}

fn()