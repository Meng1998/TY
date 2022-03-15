namespace CsharpDemo
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.comBox_Speed = new System.Windows.Forms.ComboBox();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.textBox_Result = new System.Windows.Forms.TextBox();
            this.Btn_Init = new System.Windows.Forms.Button();
            this.Btn_Fini = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.textBox_PreviewUrl = new System.Windows.Forms.TextBox();
            this.Btn_StartPreview = new System.Windows.Forms.Button();
            this.Btn_StopPreview = new System.Windows.Forms.Button();
            this.label6 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.textBox_PlaybackUrl = new System.Windows.Forms.TextBox();
            this.label8 = new System.Windows.Forms.Label();
            this.Btn_StopPlayback = new System.Windows.Forms.Button();
            this.Btn_StartPlayback = new System.Windows.Forms.Button();
            this.label9 = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.dateTimePicker_PlaybackBegin = new System.Windows.Forms.DateTimePicker();
            this.dateTimePicker_PlaybackEnd = new System.Windows.Forms.DateTimePicker();
            this.pictureBox_Play = new System.Windows.Forms.PictureBox();
            this.Btn_OpenVoice = new System.Windows.Forms.Button();
            this.Btn_CloseVoice = new System.Windows.Forms.Button();
            this.Btn_SetVoice = new System.Windows.Forms.Button();
            this.Btn_GetVoice = new System.Windows.Forms.Button();
            this.Btn_Pause = new System.Windows.Forms.Button();
            this.Btn_Resume = new System.Windows.Forms.Button();
            this.textBox_Voice = new System.Windows.Forms.TextBox();
            this.Btn_SetSpeed = new System.Windows.Forms.Button();
            this.textBox_SnapFile = new System.Windows.Forms.TextBox();
            this.label11 = new System.Windows.Forms.Label();
            this.Btn_Snap = new System.Windows.Forms.Button();
            this.label12 = new System.Windows.Forms.Label();
            this.label13 = new System.Windows.Forms.Label();
            this.dateTimePicker_DownloadEnd = new System.Windows.Forms.DateTimePicker();
            this.dateTimePicker_DownloadBegin = new System.Windows.Forms.DateTimePicker();
            this.label14 = new System.Windows.Forms.Label();
            this.label15 = new System.Windows.Forms.Label();
            this.textBox_DownloadUrl = new System.Windows.Forms.TextBox();
            this.label16 = new System.Windows.Forms.Label();
            this.label17 = new System.Windows.Forms.Label();
            this.label18 = new System.Windows.Forms.Label();
            this.textBox_DownloadFile = new System.Windows.Forms.TextBox();
            this.label19 = new System.Windows.Forms.Label();
            this.Btn_StopDownload = new System.Windows.Forms.Button();
            this.Btn_StartDownload = new System.Windows.Forms.Button();
            this.textBox_DownloadPackageSize = new System.Windows.Forms.TextBox();
            this.textBox_DownloadSize = new System.Windows.Forms.TextBox();
            this.label20 = new System.Windows.Forms.Label();
            this.label21 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.textBox_DownloadPrecent = new System.Windows.Forms.TextBox();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox_Play)).BeginInit();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // comBox_Speed
            // 
            this.comBox_Speed.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comBox_Speed.FormattingEnabled = true;
            this.comBox_Speed.Items.AddRange(new object[] {
            "16",
            "8",
            "4",
            "2",
            "1",
            "-2",
            "-4",
            "-8",
            "-16"});
            this.comBox_Speed.Location = new System.Drawing.Point(403, 240);
            this.comBox_Speed.Name = "comBox_Speed";
            this.comBox_Speed.Size = new System.Drawing.Size(67, 20);
            this.comBox_Speed.TabIndex = 31;
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.textBox_Result);
            this.groupBox1.Location = new System.Drawing.Point(672, 382);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(337, 151);
            this.groupBox1.TabIndex = 1;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "状态";
            // 
            // textBox_Result
            // 
            this.textBox_Result.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBox_Result.Location = new System.Drawing.Point(3, 17);
            this.textBox_Result.Multiline = true;
            this.textBox_Result.Name = "textBox_Result";
            this.textBox_Result.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.textBox_Result.Size = new System.Drawing.Size(331, 131);
            this.textBox_Result.TabIndex = 0;
            this.textBox_Result.TextChanged += new System.EventHandler(this.textBox_Result_TextChanged);
            // 
            // Btn_Init
            // 
            this.Btn_Init.Location = new System.Drawing.Point(91, 36);
            this.Btn_Init.Name = "Btn_Init";
            this.Btn_Init.Size = new System.Drawing.Size(75, 23);
            this.Btn_Init.TabIndex = 2;
            this.Btn_Init.Text = "初始化";
            this.Btn_Init.UseVisualStyleBackColor = true;
            this.Btn_Init.Click += new System.EventHandler(this.Btn_Init_Click);
            // 
            // Btn_Fini
            // 
            this.Btn_Fini.Location = new System.Drawing.Point(255, 36);
            this.Btn_Fini.Name = "Btn_Fini";
            this.Btn_Fini.Size = new System.Drawing.Size(75, 23);
            this.Btn_Fini.TabIndex = 3;
            this.Btn_Fini.Text = "反初始化";
            this.Btn_Fini.UseVisualStyleBackColor = true;
            this.Btn_Fini.Click += new System.EventHandler(this.Btn_Fini_Click);
            // 
            // label1
            // 
            this.label1.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label1.Location = new System.Drawing.Point(21, 28);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(500, 2);
            this.label1.TabIndex = 4;
            this.label1.Text = "label1";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(19, 7);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(95, 12);
            this.label2.TabIndex = 5;
            this.label2.Text = "初始化/反初始化";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(19, 64);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(29, 12);
            this.label3.TabIndex = 7;
            this.label3.Text = "预览";
            // 
            // label4
            // 
            this.label4.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label4.Location = new System.Drawing.Point(21, 83);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(500, 2);
            this.label4.TabIndex = 6;
            this.label4.Text = "label4";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(40, 97);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(29, 12);
            this.label5.TabIndex = 8;
            this.label5.Text = "URL:";
            // 
            // textBox_PreviewUrl
            // 
            this.textBox_PreviewUrl.Location = new System.Drawing.Point(91, 94);
            this.textBox_PreviewUrl.Name = "textBox_PreviewUrl";
            this.textBox_PreviewUrl.Size = new System.Drawing.Size(388, 21);
            this.textBox_PreviewUrl.TabIndex = 9;
            // 
            // Btn_StartPreview
            // 
            this.Btn_StartPreview.Location = new System.Drawing.Point(91, 123);
            this.Btn_StartPreview.Name = "Btn_StartPreview";
            this.Btn_StartPreview.Size = new System.Drawing.Size(75, 23);
            this.Btn_StartPreview.TabIndex = 10;
            this.Btn_StartPreview.Text = "开始预览";
            this.Btn_StartPreview.UseVisualStyleBackColor = true;
            this.Btn_StartPreview.Click += new System.EventHandler(this.Btn_StartPreview_Click);
            // 
            // Btn_StopPreview
            // 
            this.Btn_StopPreview.Location = new System.Drawing.Point(255, 123);
            this.Btn_StopPreview.Name = "Btn_StopPreview";
            this.Btn_StopPreview.Size = new System.Drawing.Size(75, 23);
            this.Btn_StopPreview.TabIndex = 11;
            this.Btn_StopPreview.Text = "停止预览";
            this.Btn_StopPreview.UseVisualStyleBackColor = true;
            this.Btn_StopPreview.Click += new System.EventHandler(this.Btn_StopPreview_Click);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(19, 157);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(29, 12);
            this.label6.TabIndex = 13;
            this.label6.Text = "回放";
            // 
            // label7
            // 
            this.label7.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label7.Location = new System.Drawing.Point(21, 178);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(500, 2);
            this.label7.TabIndex = 12;
            this.label7.Text = "label7";
            // 
            // textBox_PlaybackUrl
            // 
            this.textBox_PlaybackUrl.Location = new System.Drawing.Point(91, 186);
            this.textBox_PlaybackUrl.Name = "textBox_PlaybackUrl";
            this.textBox_PlaybackUrl.Size = new System.Drawing.Size(388, 21);
            this.textBox_PlaybackUrl.TabIndex = 15;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(40, 189);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(29, 12);
            this.label8.TabIndex = 14;
            this.label8.Text = "URL:";
            // 
            // Btn_StopPlayback
            // 
            this.Btn_StopPlayback.Location = new System.Drawing.Point(104, 238);
            this.Btn_StopPlayback.Name = "Btn_StopPlayback";
            this.Btn_StopPlayback.Size = new System.Drawing.Size(75, 23);
            this.Btn_StopPlayback.TabIndex = 17;
            this.Btn_StopPlayback.Text = "停止回放";
            this.Btn_StopPlayback.UseVisualStyleBackColor = true;
            this.Btn_StopPlayback.Click += new System.EventHandler(this.Btn_StopPlayback_Click);
            // 
            // Btn_StartPlayback
            // 
            this.Btn_StartPlayback.Location = new System.Drawing.Point(23, 238);
            this.Btn_StartPlayback.Name = "Btn_StartPlayback";
            this.Btn_StartPlayback.Size = new System.Drawing.Size(75, 23);
            this.Btn_StartPlayback.TabIndex = 16;
            this.Btn_StartPlayback.Text = "开始回放";
            this.Btn_StartPlayback.UseVisualStyleBackColor = true;
            this.Btn_StartPlayback.Click += new System.EventHandler(this.Btn_StartPlayback_Click);
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(31, 216);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(59, 12);
            this.label9.TabIndex = 18;
            this.label9.Text = "开始时间:";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(269, 217);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(59, 12);
            this.label10.TabIndex = 19;
            this.label10.Text = "结束时间:";
            // 
            // dateTimePicker_PlaybackBegin
            // 
            this.dateTimePicker_PlaybackBegin.CustomFormat = "yyyy-MM-dd HH:mm:ss";
            this.dateTimePicker_PlaybackBegin.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.dateTimePicker_PlaybackBegin.Location = new System.Drawing.Point(93, 212);
            this.dateTimePicker_PlaybackBegin.Name = "dateTimePicker_PlaybackBegin";
            this.dateTimePicker_PlaybackBegin.Size = new System.Drawing.Size(158, 21);
            this.dateTimePicker_PlaybackBegin.TabIndex = 20;
            // 
            // dateTimePicker_PlaybackEnd
            // 
            this.dateTimePicker_PlaybackEnd.CustomFormat = "yyyy-MM-dd HH:mm:ss";
            this.dateTimePicker_PlaybackEnd.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.dateTimePicker_PlaybackEnd.Location = new System.Drawing.Point(334, 212);
            this.dateTimePicker_PlaybackEnd.Name = "dateTimePicker_PlaybackEnd";
            this.dateTimePicker_PlaybackEnd.Size = new System.Drawing.Size(158, 21);
            this.dateTimePicker_PlaybackEnd.TabIndex = 21;
            // 
            // pictureBox_Play
            // 
            this.pictureBox_Play.Location = new System.Drawing.Point(528, 12);
            this.pictureBox_Play.Name = "pictureBox_Play";
            this.pictureBox_Play.Size = new System.Drawing.Size(481, 368);
            this.pictureBox_Play.TabIndex = 22;
            this.pictureBox_Play.TabStop = false;
            // 
            // Btn_OpenVoice
            // 
            this.Btn_OpenVoice.Location = new System.Drawing.Point(21, 302);
            this.Btn_OpenVoice.Name = "Btn_OpenVoice";
            this.Btn_OpenVoice.Size = new System.Drawing.Size(75, 23);
            this.Btn_OpenVoice.TabIndex = 23;
            this.Btn_OpenVoice.Text = "打开声音";
            this.Btn_OpenVoice.UseVisualStyleBackColor = true;
            this.Btn_OpenVoice.Click += new System.EventHandler(this.Btn_OpenVoice_Click);
            // 
            // Btn_CloseVoice
            // 
            this.Btn_CloseVoice.Location = new System.Drawing.Point(102, 302);
            this.Btn_CloseVoice.Name = "Btn_CloseVoice";
            this.Btn_CloseVoice.Size = new System.Drawing.Size(75, 23);
            this.Btn_CloseVoice.TabIndex = 24;
            this.Btn_CloseVoice.Text = "关闭声音";
            this.Btn_CloseVoice.UseVisualStyleBackColor = true;
            this.Btn_CloseVoice.Click += new System.EventHandler(this.Btn_CloseVoice_Click);
            // 
            // Btn_SetVoice
            // 
            this.Btn_SetVoice.Location = new System.Drawing.Point(214, 302);
            this.Btn_SetVoice.Name = "Btn_SetVoice";
            this.Btn_SetVoice.Size = new System.Drawing.Size(75, 23);
            this.Btn_SetVoice.TabIndex = 25;
            this.Btn_SetVoice.Text = "设置音量";
            this.Btn_SetVoice.UseVisualStyleBackColor = true;
            this.Btn_SetVoice.Click += new System.EventHandler(this.Btn_SetVoice_Click);
            // 
            // Btn_GetVoice
            // 
            this.Btn_GetVoice.Location = new System.Drawing.Point(393, 302);
            this.Btn_GetVoice.Name = "Btn_GetVoice";
            this.Btn_GetVoice.Size = new System.Drawing.Size(75, 23);
            this.Btn_GetVoice.TabIndex = 26;
            this.Btn_GetVoice.Text = "获取音量";
            this.Btn_GetVoice.UseVisualStyleBackColor = true;
            this.Btn_GetVoice.Click += new System.EventHandler(this.Btn_GetVoice_Click);
            // 
            // Btn_Pause
            // 
            this.Btn_Pause.Location = new System.Drawing.Point(185, 238);
            this.Btn_Pause.Name = "Btn_Pause";
            this.Btn_Pause.Size = new System.Drawing.Size(55, 23);
            this.Btn_Pause.TabIndex = 27;
            this.Btn_Pause.Text = "暂停";
            this.Btn_Pause.UseVisualStyleBackColor = true;
            this.Btn_Pause.Click += new System.EventHandler(this.Btn_Pause_Click);
            // 
            // Btn_Resume
            // 
            this.Btn_Resume.Location = new System.Drawing.Point(246, 238);
            this.Btn_Resume.Name = "Btn_Resume";
            this.Btn_Resume.Size = new System.Drawing.Size(55, 23);
            this.Btn_Resume.TabIndex = 28;
            this.Btn_Resume.Text = "恢复";
            this.Btn_Resume.UseVisualStyleBackColor = true;
            this.Btn_Resume.Click += new System.EventHandler(this.Btn_Resume_Click);
            // 
            // textBox_Voice
            // 
            this.textBox_Voice.Location = new System.Drawing.Point(306, 304);
            this.textBox_Voice.Name = "textBox_Voice";
            this.textBox_Voice.Size = new System.Drawing.Size(73, 21);
            this.textBox_Voice.TabIndex = 29;
            // 
            // Btn_SetSpeed
            // 
            this.Btn_SetSpeed.Location = new System.Drawing.Point(319, 238);
            this.Btn_SetSpeed.Name = "Btn_SetSpeed";
            this.Btn_SetSpeed.Size = new System.Drawing.Size(75, 23);
            this.Btn_SetSpeed.TabIndex = 30;
            this.Btn_SetSpeed.Text = "设置倍速";
            this.Btn_SetSpeed.UseVisualStyleBackColor = true;
            this.Btn_SetSpeed.Click += new System.EventHandler(this.Btn_SetSpeed_Click);
            // 
            // textBox_SnapFile
            // 
            this.textBox_SnapFile.Location = new System.Drawing.Point(76, 335);
            this.textBox_SnapFile.Name = "textBox_SnapFile";
            this.textBox_SnapFile.Size = new System.Drawing.Size(388, 21);
            this.textBox_SnapFile.TabIndex = 33;
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(14, 338);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(59, 12);
            this.label11.TabIndex = 32;
            this.label11.Text = "图片名称:";
            // 
            // Btn_Snap
            // 
            this.Btn_Snap.Location = new System.Drawing.Point(470, 335);
            this.Btn_Snap.Name = "Btn_Snap";
            this.Btn_Snap.Size = new System.Drawing.Size(48, 23);
            this.Btn_Snap.TabIndex = 34;
            this.Btn_Snap.Text = "抓图";
            this.Btn_Snap.UseVisualStyleBackColor = true;
            this.Btn_Snap.Click += new System.EventHandler(this.Btn_Snap_Click);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(19, 273);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(59, 12);
            this.label12.TabIndex = 36;
            this.label12.Text = "声音/图片";
            // 
            // label13
            // 
            this.label13.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label13.Location = new System.Drawing.Point(21, 294);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(500, 2);
            this.label13.TabIndex = 35;
            this.label13.Text = "label13";
            // 
            // dateTimePicker_DownloadEnd
            // 
            this.dateTimePicker_DownloadEnd.CustomFormat = "yyyy-MM-dd HH:mm:ss";
            this.dateTimePicker_DownloadEnd.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.dateTimePicker_DownloadEnd.Location = new System.Drawing.Point(334, 435);
            this.dateTimePicker_DownloadEnd.Name = "dateTimePicker_DownloadEnd";
            this.dateTimePicker_DownloadEnd.Size = new System.Drawing.Size(158, 21);
            this.dateTimePicker_DownloadEnd.TabIndex = 44;
            // 
            // dateTimePicker_DownloadBegin
            // 
            this.dateTimePicker_DownloadBegin.CustomFormat = "yyyy-MM-dd HH:mm:ss";
            this.dateTimePicker_DownloadBegin.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.dateTimePicker_DownloadBegin.Location = new System.Drawing.Point(93, 435);
            this.dateTimePicker_DownloadBegin.Name = "dateTimePicker_DownloadBegin";
            this.dateTimePicker_DownloadBegin.Size = new System.Drawing.Size(158, 21);
            this.dateTimePicker_DownloadBegin.TabIndex = 43;
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(269, 439);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(59, 12);
            this.label14.TabIndex = 42;
            this.label14.Text = "结束时间:";
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(31, 439);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(59, 12);
            this.label15.TabIndex = 41;
            this.label15.Text = "开始时间:";
            // 
            // textBox_DownloadUrl
            // 
            this.textBox_DownloadUrl.Location = new System.Drawing.Point(105, 405);
            this.textBox_DownloadUrl.Name = "textBox_DownloadUrl";
            this.textBox_DownloadUrl.Size = new System.Drawing.Size(388, 21);
            this.textBox_DownloadUrl.TabIndex = 40;
            // 
            // label16
            // 
            this.label16.AutoSize = true;
            this.label16.Location = new System.Drawing.Point(40, 408);
            this.label16.Name = "label16";
            this.label16.Size = new System.Drawing.Size(29, 12);
            this.label16.TabIndex = 39;
            this.label16.Text = "URL:";
            // 
            // label17
            // 
            this.label17.AutoSize = true;
            this.label17.Location = new System.Drawing.Point(19, 371);
            this.label17.Name = "label17";
            this.label17.Size = new System.Drawing.Size(29, 12);
            this.label17.TabIndex = 38;
            this.label17.Text = "下载";
            // 
            // label18
            // 
            this.label18.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label18.Location = new System.Drawing.Point(21, 391);
            this.label18.Name = "label18";
            this.label18.Size = new System.Drawing.Size(500, 2);
            this.label18.TabIndex = 37;
            this.label18.Text = "label18";
            // 
            // textBox_DownloadFile
            // 
            this.textBox_DownloadFile.Location = new System.Drawing.Point(103, 462);
            this.textBox_DownloadFile.Name = "textBox_DownloadFile";
            this.textBox_DownloadFile.Size = new System.Drawing.Size(388, 21);
            this.textBox_DownloadFile.TabIndex = 46;
            // 
            // label19
            // 
            this.label19.AutoSize = true;
            this.label19.Location = new System.Drawing.Point(9, 465);
            this.label19.Name = "label19";
            this.label19.Size = new System.Drawing.Size(89, 12);
            this.label19.TabIndex = 45;
            this.label19.Text = "绝对路径名称：";
            // 
            // Btn_StopDownload
            // 
            this.Btn_StopDownload.Location = new System.Drawing.Point(102, 490);
            this.Btn_StopDownload.Name = "Btn_StopDownload";
            this.Btn_StopDownload.Size = new System.Drawing.Size(75, 23);
            this.Btn_StopDownload.TabIndex = 48;
            this.Btn_StopDownload.Text = "停止下载";
            this.Btn_StopDownload.UseVisualStyleBackColor = true;
            this.Btn_StopDownload.Click += new System.EventHandler(this.Btn_StopDownload_Click);
            // 
            // Btn_StartDownload
            // 
            this.Btn_StartDownload.Location = new System.Drawing.Point(21, 490);
            this.Btn_StartDownload.Name = "Btn_StartDownload";
            this.Btn_StartDownload.Size = new System.Drawing.Size(75, 23);
            this.Btn_StartDownload.TabIndex = 47;
            this.Btn_StartDownload.Text = "开始下载";
            this.Btn_StartDownload.UseVisualStyleBackColor = true;
            this.Btn_StartDownload.Click += new System.EventHandler(this.Btn_StartDownload_Click);
            // 
            // textBox_DownloadPackageSize
            // 
            this.textBox_DownloadPackageSize.Location = new System.Drawing.Point(270, 492);
            this.textBox_DownloadPackageSize.Name = "textBox_DownloadPackageSize";
            this.textBox_DownloadPackageSize.Size = new System.Drawing.Size(73, 21);
            this.textBox_DownloadPackageSize.TabIndex = 49;
            // 
            // textBox_DownloadSize
            // 
            this.textBox_DownloadSize.Location = new System.Drawing.Point(429, 492);
            this.textBox_DownloadSize.Name = "textBox_DownloadSize";
            this.textBox_DownloadSize.Size = new System.Drawing.Size(73, 21);
            this.textBox_DownloadSize.TabIndex = 50;
            // 
            // label20
            // 
            this.label20.AutoSize = true;
            this.label20.Location = new System.Drawing.Point(189, 495);
            this.label20.Name = "label20";
            this.label20.Size = new System.Drawing.Size(83, 12);
            this.label20.TabIndex = 51;
            this.label20.Text = "录像分包大小:";
            // 
            // label21
            // 
            this.label21.AutoSize = true;
            this.label21.Location = new System.Drawing.Point(352, 495);
            this.label21.Name = "label21";
            this.label21.Size = new System.Drawing.Size(71, 12);
            this.label21.TabIndex = 52;
            this.label21.Text = "录像总大小:";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.textBox_DownloadPrecent);
            this.groupBox2.Location = new System.Drawing.Point(527, 382);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(142, 151);
            this.groupBox2.TabIndex = 2;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "下载进度";
            // 
            // textBox_DownloadPrecent
            // 
            this.textBox_DownloadPrecent.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBox_DownloadPrecent.Location = new System.Drawing.Point(3, 17);
            this.textBox_DownloadPrecent.Multiline = true;
            this.textBox_DownloadPrecent.Name = "textBox_DownloadPrecent";
            this.textBox_DownloadPrecent.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.textBox_DownloadPrecent.Size = new System.Drawing.Size(136, 131);
            this.textBox_DownloadPrecent.TabIndex = 0;
            this.textBox_DownloadPrecent.TextChanged += new System.EventHandler(this.textBox_DownloadPrecent_TextChanged);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1021, 533);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.label21);
            this.Controls.Add(this.label20);
            this.Controls.Add(this.textBox_DownloadSize);
            this.Controls.Add(this.textBox_DownloadPackageSize);
            this.Controls.Add(this.Btn_StopDownload);
            this.Controls.Add(this.Btn_StartDownload);
            this.Controls.Add(this.textBox_DownloadFile);
            this.Controls.Add(this.label19);
            this.Controls.Add(this.dateTimePicker_DownloadEnd);
            this.Controls.Add(this.dateTimePicker_DownloadBegin);
            this.Controls.Add(this.label14);
            this.Controls.Add(this.label15);
            this.Controls.Add(this.textBox_DownloadUrl);
            this.Controls.Add(this.label16);
            this.Controls.Add(this.label17);
            this.Controls.Add(this.label18);
            this.Controls.Add(this.label12);
            this.Controls.Add(this.label13);
            this.Controls.Add(this.Btn_Snap);
            this.Controls.Add(this.textBox_SnapFile);
            this.Controls.Add(this.label11);
            this.Controls.Add(this.comBox_Speed);
            this.Controls.Add(this.Btn_SetSpeed);
            this.Controls.Add(this.textBox_Voice);
            this.Controls.Add(this.Btn_Resume);
            this.Controls.Add(this.Btn_Pause);
            this.Controls.Add(this.Btn_GetVoice);
            this.Controls.Add(this.Btn_SetVoice);
            this.Controls.Add(this.Btn_CloseVoice);
            this.Controls.Add(this.Btn_OpenVoice);
            this.Controls.Add(this.pictureBox_Play);
            this.Controls.Add(this.dateTimePicker_PlaybackEnd);
            this.Controls.Add(this.dateTimePicker_PlaybackBegin);
            this.Controls.Add(this.label10);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.Btn_StopPlayback);
            this.Controls.Add(this.Btn_StartPlayback);
            this.Controls.Add(this.textBox_PlaybackUrl);
            this.Controls.Add(this.label8);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.Btn_StopPreview);
            this.Controls.Add(this.Btn_StartPreview);
            this.Controls.Add(this.textBox_PreviewUrl);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.Btn_Fini);
            this.Controls.Add(this.Btn_Init);
            this.Controls.Add(this.groupBox1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.Closed += new System.EventHandler(this.Form1_FormClosing);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox_Play)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.TextBox textBox_Result;
        private System.Windows.Forms.Button Btn_Init;
        private System.Windows.Forms.Button Btn_Fini;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox textBox_PreviewUrl;
        private System.Windows.Forms.Button Btn_StartPreview;
        private System.Windows.Forms.Button Btn_StopPreview;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.TextBox textBox_PlaybackUrl;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Button Btn_StopPlayback;
        private System.Windows.Forms.Button Btn_StartPlayback;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.DateTimePicker dateTimePicker_PlaybackBegin;
        private System.Windows.Forms.DateTimePicker dateTimePicker_PlaybackEnd;
        private System.Windows.Forms.PictureBox pictureBox_Play;
        private System.Windows.Forms.Button Btn_OpenVoice;
        private System.Windows.Forms.Button Btn_CloseVoice;
        private System.Windows.Forms.Button Btn_SetVoice;
        private System.Windows.Forms.Button Btn_GetVoice;
        private System.Windows.Forms.Button Btn_Pause;
        private System.Windows.Forms.Button Btn_Resume;
        private System.Windows.Forms.TextBox textBox_Voice;
        private System.Windows.Forms.Button Btn_SetSpeed;
        private System.Windows.Forms.TextBox textBox_SnapFile;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.Button Btn_Snap;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.DateTimePicker dateTimePicker_DownloadEnd;
        private System.Windows.Forms.DateTimePicker dateTimePicker_DownloadBegin;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.TextBox textBox_DownloadUrl;
        private System.Windows.Forms.Label label16;
        private System.Windows.Forms.Label label17;
        private System.Windows.Forms.Label label18;
        private System.Windows.Forms.TextBox textBox_DownloadFile;
        private System.Windows.Forms.Label label19;
        private System.Windows.Forms.Button Btn_StopDownload;
        private System.Windows.Forms.Button Btn_StartDownload;
        private System.Windows.Forms.TextBox textBox_DownloadPackageSize;
        private System.Windows.Forms.TextBox textBox_DownloadSize;
        private System.Windows.Forms.Label label20;
        private System.Windows.Forms.Label label21;
        private System.Windows.Forms.ComboBox comBox_Speed;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.TextBox textBox_DownloadPrecent;
    }
}

