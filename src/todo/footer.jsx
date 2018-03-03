/**
 * 写jsx有缺点，css必须拆分出来，单独引用，结构不清晰
 */
import '../assets/css/footer.styl'
export default{
    data(){
        return {
            author:'Joyce Zhang'
        }
    },
    render(){
        return (
            //[].map('<li></li>'),
            <div id='footer'>
            <span>Written by {this.author}</span>
            </div>
        )
    }
}