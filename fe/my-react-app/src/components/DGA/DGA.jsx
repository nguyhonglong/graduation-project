import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import authService from '../../services/authServices';
import styles from './DGA.module.css';

const DGA = ({ currentTransformer }) => {
  const canvasRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [indexData, setIndexData] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState('');

  // Define these constants at the component level
  const v0 = { x: 114, y: 366 };
  const v1 = { x: 306, y: 30 };
  const v2 = { x: 498, y: 366 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    initializeCanvas(ctx);
  }, []);

  useEffect(() => {
    if (currentTransformer && selectedDate) {
      fetchIndexData();
    }
  }, [currentTransformer, selectedDate]);

  const fetchIndexData = async () => {
    if (!authService.isLoggedIn()) {
      console.log('Not logged in');
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const response = await axios.get(
        `https://graduation-project-be-eight.vercel.app/v1/indexes/getIndexesByDay/${currentTransformer._id}?date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`
          }
        }
      );
      setIndexData(response.data);
      // Call calcOpr with the fetched data
      calcOpr(response.data.Methane, response.data.Ethane, response.data.Ethylene);
    } catch (error) {
      console.error('Error fetching index data:', error);
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, handle accordingly (e.g., redirect to login)
      }
    }
  };

  const calcOpr = (ch4, c2h2, c2h4) => {
    console.log(ch4, c2h2, c2h4);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const val1 = parseFloat(ch4);
    const val2 = parseFloat(c2h2);
    const val3 = parseFloat(c2h4);

    function calcOprByValue(ch4, c2h2, c2h4) {
      const total = ch4 + c2h2 + c2h4;
      const ch4_contr = ch4 / total;
      const c2h2_contr = c2h2 / total;
      const c2h4_contr = c2h4 / total;

      const c2h2_line = BottomCoordinates(c2h2_contr);
      const ch4_line = LeftCoordinates(ch4_contr);
      const c2h4_line = RightCoordinates(c2h4_contr);

      const ch4x = ch4_line.x;
      const ch4y = ch4_line.y;
      const c2h4x = c2h4_line.x;
      const c2h4y = c2h4_line.y;
      const c2h2x = c2h2_line.x;
      const c2h2y = c2h2_line.y;

      const ref_ch4 = refLeftCoordinates(ch4_contr);
      const ref_c2h4 = refRightCoordinates(c2h4_contr);

      const res = checkLineIntersection(
        ch4_line.x, ch4_line.y, ref_ch4.x, ref_ch4.y,
        c2h4_line.x, c2h4_line.y, ref_c2h4.x, ref_c2h4.y
      );

      const color = detectColor(res.x, res.y);
      const diagResult = findAndDisplayColor(color);
      setDiagnosisResult(diagResult);

      drawCoordinates(res.x, res.y);
      drawCords(res.x, res.y, ch4x, ch4y, c2h4x, c2h4y, c2h2x, c2h2y);
      console.log(val1, val2, val3);
    }

    calcOprByValue(val1, val2, val3);
  };

  const initializeCanvas = (ctx) => {
    var pointSize = 4.5;
    const triangle = [v0, v1, v2];
    ctx.font = '14px arial black';

    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(50, 454, 20, 10);
    ctx.fillStyle = 'rgb(255,102,153)';
    ctx.fillRect(50, 469, 20, 10);
    ctx.fillStyle = 'rgb(255,204,0)';
    ctx.fillRect(50, 484, 20, 10);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(50, 499, 20, 10);
    ctx.fillStyle = 'rgb(172,236,222)';
    ctx.fillRect(50, 514, 20, 10);
    ctx.fillStyle = 'rgb(51,51,153)';
    ctx.fillRect(50, 529, 20, 10);
    ctx.fillStyle = 'rgb(153,0,153)';
    ctx.fillRect(50, 544, 20, 10);
    // ctx.fillStyle = "black";
    // // ctx.fillText("Diagnosis Result:", 350, 538, 300);
    var ch4x, ch4y, c2h4x, c2h4y, c2h2x, c2h2y;
    var segments = [{
      points: [{
        x: 114,
        y: 366
      }, {
        x: 281,
        y: 76
      }, {
        x: 324,
        y: 150
      }, {
        x: 201,
        y: 366
      }],
      fill: 'rgb(172,236,222)',
      label: {
        text: 'D1',
        cx: 165,
        cy: 395,
        withLine: false,
        endX: null,
        endY: null
      },
    },
    {
      points: [{
        x: 385,
        y: 366
      }, {
        x: 201,
        y: 366
      }, {
        x: 324,
        y: 150
      }, {
        x: 356,
        y: 204
      }, {
        x: 321,
        y: 256
      }],
      fill: 'rgb(51,51,153)',
      label: {
        text: 'D2',
        cx: 300,
        cy: 395,
        withLine: false,
        endX: null,
        endY: null
      },
    },
    {
      points: [{
        x: 297,
        y: 46
      }, {
        x: 392,
        y: 214
      }, {
        x: 372,
        y: 248
      }, {
        x: 441,
        y: 366
      }, {
        x: 385,
        y: 366
      }, {
        x: 321,
        y: 256
      }, {
        x: 356,
        y: 204
      }, {
        x: 281,
        y: 76
      }],
      fill: 'rgb(153,0,153)',
      label: {
        text: 'DT',
        cx: 245,
        cy: 60,
        withLine: true,
        endX: 280,
        endY: 55
      },
    },
    {
      points: [{
        x: 306,
        y: 30
      }, {
        x: 312,
        y: 40
      }, {
        x: 300,
        y: 40
      }],
      fill: 'rgb(255,0,0)',
      label: {
        text: 'PD',
        cx: 356,
        cy: 40,
        withLine: true,
        endX: 321,
        endY: 40
      },
    },
    {
      points: [{
        x: 312,
        y: 40
      }, {
        x: 348,
        y: 103
      }, {
        x: 337,
        y: 115
      }, {
        x: 297,
        y: 46
      }, {
        x: 300,
        y: 40
      }],
      fill: 'rgb(255,153,153)',
      label: {
        text: 'T1',
        cx: 375,
        cy: 70,
        withLine: true,
        endX: 340,
        endY: 75
      },
    },
    {
      points: [{
        x: 348,
        y: 103
      }, {
        x: 402,
        y: 199
      }, {
        x: 392,
        y: 214
      }, {
        x: 337,
        y: 115
      }],
      fill: 'rgb(255,204,0)',
      label: {
        text: 'T2',
        cx: 400,
        cy: 125,
        withLine: true,
        endX: 366,
        endY: 120
      },
    },
    {
      points: [{
        x: 402,
        y: 199
      }, {
        x: 498,
        y: 366
      }, {
        x: 441,
        y: 366
      }, {
        x: 372,
        y: 248
      }],
      fill: 'rgb(0,0,0)',
      label: {
        text: 'T3',
        cx: 480,
        cy: 270,
        withLine: true,
        endX: 450,
        endY: 270
      },
    },
    ];

    var labelfontsize = 12;
    var labelfontface = 'verdana';
    var labelpadding = 3;
    var arrowheadLength = 10;
    var arrowheadWidth = 8;
    var arrowhead = document.createElement('canvas');
    premakeArrowhead();

    var legendTexts = ['PD = Partial Discharge',
      'T1 = Thermal fault < 300 celcius',
      'T2 = Thermal fault 300 < T < 700 celcius',
      'T3 = Thermal fault < 300 celcius',
      'D1 = Thermal fault T > 700 celcius',
      'D2 = Discharge of High Energy',
      'DT = Electrical and Thermal'
    ];
    for (var i = 0; i < segments.length; i++) {
      drawSegment(segments[i]);
    }
    ticklines(v0, v1, 9, 0, 20);
    ticklines(v1, v2, 9, Math.PI * 3 / 4, 20);
    ticklines(v2, v0, 9, Math.PI * 5 / 4, 20);
    moleculeLabel(v0, v1, 100, Math.PI, '% CH4');
    moleculeLabel(v1, v2, 100, 0, '% C2H4');
    moleculeLabel(v2, v0, 75, Math.PI / 2, '% C2H2');
    drawTriangle(triangle);
    drawLegend(legendTexts, 75, 450, 15);
    function drawSegment(s) {
      // draw and fill the segment path
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (var i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = s.fill;
      ctx.fill();
      ctx.lineWidth = 0;
      ctx.strokeStyle = 'black';
      ctx.stroke();
      // draw segment's box label
      if (s.label.withLine) {
        lineBoxedLabel(s, labelfontsize, labelfontface, labelpadding);
      } else {
        boxedLabel(s, labelfontsize, labelfontface, labelpadding);
      }
    }
    function moleculeLabel(start, end, offsetLength, angle, text) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px verdana';
      var dx = end.x - start.x;
      var dy = end.y - start.y;
      var x0 = parseInt(start.x + dx * 0.50);
      var y0 = parseInt(start.y + dy * 0.50);
      var x1 = parseInt(x0 + offsetLength * Math.cos(angle));
      var y1 = parseInt(y0 + offsetLength * Math.sin(angle));
      ctx.fillStyle = 'black';
      ctx.fillText(text, x1, y1);
      // arrow
      x0 = parseInt(start.x + dx * 0.35);
      y0 = parseInt(start.y + dy * 0.35);
      x1 = parseInt(x0 + 50 * Math.cos(angle));
      y1 = parseInt(y0 + 50 * Math.sin(angle));
      var x2 = parseInt(start.x + dx * 0.65);
      var y2 = parseInt(start.y + dy * 0.65);
      var x3 = parseInt(x2 + 50 * Math.cos(angle));
      var y3 = parseInt(y2 + 50 * Math.sin(angle));
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x3, y3);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.stroke();
      angle = Math.atan2(dy, dx);
      ctx.translate(x3, y3);
      ctx.rotate(angle);
      ctx.drawImage(arrowhead, -arrowheadLength, -arrowheadWidth / 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    function boxedLabel(s, fontsize, fontface, padding) {
      var centerX = s.label.cx;
      var centerY = s.label.cy;
      var text = s.label.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = fontsize + 'px ' + fontface;
      var textwidth = ctx.measureText(text).width;
      var textheight = fontsize * 1.286;
      var leftX = centerX - textwidth / 2 - padding;
      var topY = centerY - textheight / 2 - padding;
      ctx.fillStyle = 'white';
      ctx.fillRect(leftX, topY, textwidth + padding * 2, textheight + padding * 2);
      ctx.lineWidth = 1;
      ctx.strokeRect(leftX, topY, textwidth + padding * 2, textheight + padding * 2);
      ctx.fillStyle = 'black';
      ctx.fillText(text, centerX, centerY);
    }
    function lineBoxedLabel(s, fontsize, fontface, padding) {
      var centerX = s.label.cx;
      var centerY = s.label.cy;
      var text = s.label.text;
      var lineToX = s.label.endX;
      var lineToY = s.label.endY;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = fontsize + 'px ' + fontface;
      var textwidth = ctx.measureText(text).width;
      var textheight = fontsize * 1.286;
      var leftX = centerX - textwidth / 2 - padding;
      var topY = centerY - textheight / 2 - padding;
      // the line
      ctx.beginPath();
      ctx.moveTo(leftX, topY + textheight / 2);
      ctx.lineTo(lineToX, topY + textheight / 2);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.stroke();
      // the boxed text
      ctx.fillStyle = 'white';
      ctx.fillRect(leftX, topY, textwidth + padding * 2, textheight + padding * 2);
      ctx.strokeRect(leftX, topY, textwidth + padding * 2, textheight + padding * 2);
      ctx.fillStyle = 'black';
      ctx.fillText(text, centerX, centerY);
    }
    function ticklines(start, end, count, angle, length) {
      var dx = end.x - start.x;
      var dy = end.y - start.y;
      ctx.lineWidth = 1;
      for (var i = 1; i < count; i++) {
        var x0 = parseInt(start.x + dx * i / count);
        var y0 = parseInt(start.y + dy * i / count);
        var x1 = parseInt(x0 + length * Math.cos(angle));
        var y1 = parseInt(y0 + length * Math.sin(angle));
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        if (i == 2 || i == 4 || i == 6 || i == 8) {
          var labelOffset = length * 3 / 4;
          x1 = parseInt(x0 - labelOffset * Math.cos(angle));
          y1 = parseInt(y0 - labelOffset * Math.sin(angle));
          ctx.fillStyle = 'black';
          ctx.fillText(parseInt(i * 10), x1, y1);
        }
      }
    }
    function premakeArrowhead() {
      var actx = arrowhead.getContext('2d');
      arrowhead.width = arrowheadLength;
      arrowhead.height = arrowheadWidth;
      actx.beginPath();
      actx.moveTo(0, 0);
      actx.lineTo(arrowheadLength, arrowheadWidth / 2);
      actx.lineTo(0, arrowheadWidth);
      actx.closePath();
      actx.fillStyle = 'black';
      actx.fill();
    }
    function drawTriangle(t) {
      ctx.beginPath();
      ctx.moveTo(t[0].x, t[0].y);
      ctx.lineTo(t[1].x, t[1].y);
      ctx.lineTo(t[2].x, t[2].y);
      ctx.closePath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    function drawLegend(texts, x, y, lineheight) {
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'black';
      ctx.font = '14px Verdana';
      for (var i = 0; i < texts.length; i++) {
        ctx.fillText(texts[i], x, y + i * lineheight);
      }
    }
    function drawCoordinates(x, y) {
      ctx.fillStyle = "white"; // Red color
      ctx.beginPath();
      ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
    }
    function drawCords(x, y) {
      ctx.moveTo(x, y);
      ctx.lineTo(ch4x, ch4y);
      ctx.moveTo(x, y);
      ctx.lineTo(c2h4x, c2h4y);
      ctx.moveTo(x, y);
      ctx.lineTo(c2h2x, c2h2y);
      ctx.strokeStyle = 'white';
      ctx.stroke();
    }
  };

  const checkLineIntersection = (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) => {
    // Calculate the denominator
    const denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));

    // If the denominator is zero, the lines are parallel
    if (denominator === 0) {
      return null;
    }

    // Calculate ua and ub
    const ua = (((line2EndX - line2StartX) * (line1StartY - line2StartY)) - ((line2EndY - line2StartY) * (line1StartX - line2StartX))) / denominator;
    const ub = (((line1EndX - line1StartX) * (line1StartY - line2StartY)) - ((line1EndY - line1StartY) * (line1StartX - line2StartX))) / denominator;

    // If ua and ub are between 0-1, lines are colliding
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return null;
    }

    // Calculate the intersection point
    const x = line1StartX + (ua * (line1EndX - line1StartX));
    const y = line1StartY + (ua * (line1EndY - line1StartY));

    return { x, y };
  };

  // Add these functions outside of calcOpr
  const BottomCoordinates = (c2h2_contr) => {
    const dx = (v2.x - v0.x) * c2h2_contr;
    const coor_x = v2.x - dx;
    const coor_y = v0.y;
    return { x: coor_x, y: coor_y };
  };

  const LeftCoordinates = (ch4_contr) => {
    const l = Math.sqrt(Math.pow((v1.x - v0.x), 2) + Math.pow((v1.y - v0.y), 2));
    const l_eff = l * ch4_contr;
    const coor_x = v0.x + l_eff * Math.cos(Math.PI / 3);
    const coor_y = v0.y - l_eff * Math.sin(Math.PI / 3);
    return { x: coor_x, y: coor_y };
  };

  const RightCoordinates = (c2h4_contr) => {
    const l = Math.sqrt(Math.pow((v1.x - v2.x), 2) + Math.pow((v1.y - v2.y), 2));
    const l_eff = l * c2h4_contr;
    const coor_x = v1.x + l_eff * Math.cos(Math.PI / 3);
    const coor_y = v1.y + l_eff * Math.sin(Math.PI / 3);
    return { x: coor_x, y: coor_y };
  };

  const refRightCoordinates = (c2h4_contr) => {
    const dx = (v2.x - v0.x) * c2h4_contr;
    const coor_x = v0.x + dx;
    const coor_y = v0.y;
    return { x: coor_x, y: coor_y };
  };

  const refLeftCoordinates = (ch4_contr) => {
    const l = Math.sqrt(Math.pow((v2.x - v1.x), 2) + Math.pow((v2.y - v1.y), 2));
    const l_eff = l * ch4_contr;
    const coor_x = v2.x - l_eff * Math.cos(Math.PI / 3);
    const coor_y = v2.y - l_eff * Math.sin(Math.PI / 3);
    return { x: coor_x, y: coor_y };
  };

  const detectColor = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(x, y, 1, 1).data;
    return { r: data[0], g: data[1], b: data[2] };
  };

  const findAndDisplayColor = (color) => {
    let diagResult;
    if (color.r === 255 && color.g === 0 && color.b === 0) {
      diagResult = "PD = Partial Discharge";
    } else if (color.r === 255 && color.g === 102 && color.b === 153) {
      diagResult = 'T1 = Thermal fault < 300 celcius';
    } else if (color.r === 255 && color.g === 204 && color.b === 0) {
      diagResult = 'T2 = Thermal fault 300 < T < 700 celcius';
    } else if (color.r === 0 && color.g === 0 && color.b === 0) {
      diagResult = 'T3 = Thermal fault > 700 celcius';
    } else if (color.r === 172 && color.g === 236 && color.b === 222) {
      diagResult = 'D1 = Low Energy Discharge';
    } else if (color.r === 51 && color.g === 51 && color.b === 153) {
      diagResult = 'D2 = High Energy Discharge';
    } else {
      diagResult = 'DT = Electrical and Thermal';
    }
    return diagResult;
  };

  const drawCoordinates = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2, true);
    ctx.fill();
  };

  const drawCords = (x, y, ch4x, ch4y, c2h4x, c2h4y, c2h2x, c2h2y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(ch4x, ch4y);
    ctx.moveTo(x, y);
    ctx.lineTo(c2h4x, c2h4y);
    ctx.moveTo(x, y);
    ctx.lineTo(c2h2x, c2h2y);
    ctx.strokeStyle = 'white';
    ctx.stroke();
  };

  return (
    <div className={styles.dgaContainer}>
      <h1>Biểu đồ khí hòa tan : {currentTransformer ? currentTransformer.name : 'Chưa chọn máy biến áp'}</h1>
      <div className={styles.dgaContent}>
        <canvas ref={canvasRef} width={580} height={580} />
        <div>
          <h3>
            Chọn ngày
          </h3>
          <div className={styles.datePickerWrapper}>
            <label>Ngày đã chọn: </label>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          {indexData && (
            <>
              <div>CH4: {indexData.Methane} ppm</div>
              <div>C2H2: {indexData.Ethane} ppm</div>
              <div>C2H4: {indexData.Ethylene} ppm</div>
            </>
          )}
          {diagnosisResult && (
            <div className={styles.diagnosisResult}>
              <strong>Diagnosis Result:</strong> {diagnosisResult}
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default DGA;