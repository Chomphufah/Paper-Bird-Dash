let move_speed = 4;
let gravity = 0.6;

// Object ต่าง ๆ ในหน้าเว็บไซต์
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-2');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

// UI ของเกม
let score_value = document.querySelector('.score_value');
let message = document.querySelector('.startMessage');
let end_message = document.querySelector('.Message');
let score_title = document.querySelector('.score_title');
let logo = document.querySelector('.logoStyle');

// สถานะเริ่มต้นของเกม
let game_state = 'Start';


img.style.display = 'none'; //ซ่อนรูปนก
message.classList.add('messageStyle'); //เพิ่มคลาสข้อความ

// enter เพื่อเริ่มเกม
document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        // ลบคลาส pipe sprites
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        // แสดงรูปนก
        img.style.display = 'block'; //แสดงภาพนก
        bird.style.top = '40%'; //ตำแหน่งของนก
        game_state = 'Play'; //อัปเดตสถานะเกม
        message.innerHTML = '';
        score_title.innerHTML = 'Score: ';
        score_value.innerHTML = '0';
        message.classList.remove('messageStyle');
        logo.style.display = 'none'; // ซ่อน logo
        play(); // เริ่มเกม
    }
});

// Main game function
function play() {
    // Move function
    function move() {
        if (game_state != 'Play') return;

        // เลือกคลาส pipe_sprite ทั้งหมด
        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();
            
            //ถ้า มุมขวาของท่อ = 0 (ออกจากหน้าจอ)จะ remove ท่อนั้นๆ
            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                //collision ของนกกับท่อ
                if (
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top
                    
                    //เมื่อตรวจพบการ collision ของนกกับท่อ เกมจะจบ
                    ) {
                    game_state = 'End';
                    message.innerHTML = 'Game Over :(' + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    return;

                    //ไม่พบการ collision ก็จะตรวจพบว่า นกผ่านช่องนั้นไปรึยัง
                } else {
                    if (
                        pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right + move_speed >= bird_props.left &&
                        element.increase_score == '1' //ได้แต้ม
                    ) {
                        score_value.innerHTML =+ score_value.innerHTML + 1;
                    } //ท่อจะขยับมาทางซ้ายความเร็วเท่ากับ move_speed
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move); //loop
    }
    requestAnimationFrame(move);

    // ความเร็วของนกแนวตั้ง
    let bird_dy = 0;
    // gravity 
    function apply_gravity() {
        if (game_state != 'Play') return;
        bird_dy = bird_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if (e.key == '32' || e.key == ' ') {
                img.src = 'assets/bird-2.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == '32' || e.key == ' ') {
                img.src = 'assets/bird.png';
            }
        });

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    // ช่องว่างกับระยะห่าง
    let pipe_separation = 50;
    let pipe_gap = 60;

    // สร้างท่อ
    function create_pipe() {
        if (game_state != 'Play') return;
        //เมื่อระยะห่างของท่อ = 120 จะ reset ค่าเป็น 0
        if (pipe_separation > 120) {
            pipe_separation = 0;
            //สมการเพื่อ generate random vertical position
            let pipe_posi = Math.floor(Math.random() * 20) + 10;
            // ท่อบน
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 75 + 'vh';
            pipe_sprite_inv.style.left = '100vw';
   
            document.body.appendChild(pipe_sprite_inv);
            // ท่อล่าง
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++; //เพิ่ม pipe_separation ขึ้นทีละ 1 หน่วย
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
