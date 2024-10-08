// https://www.acmicpc.net/problem/17144
// https://velog.io/@arthur/17144.-미세먼지-안녕-node.js-javascript


/*
* 현성준 : BOJ 17144 미세먼지 안녕!
* */

/*
* 키워드
* (r, c)는 r행 c열 -> R*C 배열을 선언해야한다
* 공기청정기는 항상 1번열 크기는 두행
* 공기청정기가 설치되어 있지 않은 칸에는 미세먼지가 랜덤하게 발생 , 겹쳐였지 않다
* 1초마다 -> 시간이 경과함에 따라 값이 변함
*
*
*
* */

let fs = require("fs");
let input = fs.readFileSync("/dev/stdin").toString().trim().split("\n");

function solution(input) {
    let [R, C, T] = input[0].split(" ").map(Number);
    input = input.slice(1).map((v) => v.split(" ").map(Number));
    let answer = 0;
    let upperCleaner = [0, 0];
    let lowerCleaner = [0, 0];
    let flag = false;
    const dx = [1, 0, -1, 0];
    const dy = [0, 1, 0, -1];

    // 미세먼지 확산
    function spreadDust() {
        let spreadList = [];
        for (let row = 0; row < R; row++) {
            for (let col = 0; col < C; col++) {
                if (input[row][col] > 0) {
                    const value = Math.floor(input[row][col] / 5);
                    for (let i = 0; i < 4; i++) {
                        const [nRow, nCol] = [row + dx[i], col + dy[i]];
                        if (nRow < 0 || nRow >= R || nCol < 0 || nCol >= C || input[nRow][nCol] === -1) continue;
                        spreadList.push([nRow, nCol, value]);
                        input[row][col] -= value;
                    }
                }
            }
        }

        for (let spread of spreadList) {
            const [row, col, value] = spread;
            input[row][col] += value;
        }
    }

    // 위쪽 공기청정기 순환 (반시계방향)
    function rotateUp(cleanerRow) {
        for (let row = cleanerRow - 2; row >= 0; row--) {
            input[row + 1][0] = input[row][0];
        }

        for (let col = 1; col < C; col++) {
            input[0][col - 1] = input[0][col];
        }

        for (let row = 1; row <= cleanerRow; row++) {
            input[row - 1][C - 1] = input[row][C - 1];
        }

        for (let col = C - 2; col > 0; col--) {
            input[cleanerRow][col + 1] = input[cleanerRow][col];
        }

        input[cleanerRow][1] = 0;
    }

    // 아래쪽 공기청정기 순환 (시계방향)
    function rotateDown(cleanerRow) {
        for (let row = cleanerRow + 2; row < R; row++) {
            input[row - 1][0] = input[row][0];
        }

        for (let col = 1; col < C; col++) {
            input[R - 1][col - 1] = input[R - 1][col];
        }

        for (let row = R - 2; row >= cleanerRow; row--) {
            input[row + 1][C - 1] = input[row][C - 1];
        }

        for (let col = C - 2; col > 0; col--) {
            input[cleanerRow][col + 1] = input[cleanerRow][col];
        }

        input[cleanerRow][1] = 0;
    }

    // 남아있는 미세먼지 양 계산
    function countDust() {
        let result = 0;
        for (let row = 0; row < R; row++) {
            for (let col = 0; col < C; col++) {
                if (input[row][col] > 0) result += input[row][col];
            }
        }
        return result;
    }

    // 공기 청정기 위치 찾기
    for (let row = 0; row < R; row++) {
        for (let col = 0; col < C; col++) {
            if (input[row][col] === -1) {
                upperCleaner = row;
                lowerCleaner = row + 1;
                flag = true;
                break;
            }
        }
        if (flag) break;
    }

    // T 만큼 진행 (확산 -> 위쪽 순환 -> 아래쪽 순환)
    while (T--) {
        spreadDust();
        rotateUp(upperCleaner);
        rotateDown(lowerCleaner);
    }

    answer = countDust();
    return answer;
}

console.log(solution(input));