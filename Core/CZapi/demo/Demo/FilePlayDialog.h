#pragma once
#include "afxwin.h"


// CFilePlay 对话框

class CFilePlayDialog : public CDialog
{
	DECLARE_DYNAMIC(CFilePlayDialog)

public:
	CFilePlayDialog(CWnd* pParent = NULL);   // 标准构造函数
	virtual ~CFilePlayDialog();

	// 本接口中实现本模块各个控件的tooltip
	void NotifyDialogInited(const char* exeFolder = nullptr);

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_DIALOG_FILEPLAY };
#endif

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

	DECLARE_MESSAGE_MAP()

	virtual BOOL PreTranslateMessage(MSG* pMsg);

private:
	CToolTipCtrl _toolTip;
public:
    afx_msg void OnOK() {};  // 防止回车后窗口不见了
    afx_msg void OnCancel() {};  // 防止回车后窗口不见了
    afx_msg void OnBnClickedButtonStartfileplay();
    afx_msg void OnBnClickedButtonStopfileplay();
    afx_msg void OnBnClickedButtonGetfileduration();
    afx_msg void OnBnClickedButtonGetfileplayedtime();
    afx_msg void OnBnClickedButtonOpenfilevoice();
    afx_msg void OnBnClickedButtonClosefilevoice();
    afx_msg void OnBnClickedButtonSetvolume();
    afx_msg void OnBnClickedButtonGetvolume();
    afx_msg void OnBnClickedButtonFileplaysnap();
	afx_msg void OnLbnDblclkListPlaybackMsgbox();
	afx_msg void OnBnClickedButtonFileplayPause();
	afx_msg void OnBnClickedButtonFileplayResume();
	afx_msg void OnBnClickedButtonFileplaySpeedplay();
	afx_msg void OnBnClickedButtonFileplaySeekplay();
	afx_msg void OnBnClickedButtonFileplayPrivateOpen();
	afx_msg void OnBnClickedButtonFileplayPrivateClose();
    afx_msg LRESULT _onUpdateMsg(WPARAM wparam, LPARAM lparam);

private:
    void _printMsg(const std::string& msg);
    void _printMsg(const std::string& func, int ret, int errcodeCode, ULONGLONG costs);

    void _showListHovScollBar();

protected:
    static void __stdcall cb_msgCallback(VIDEO_INT64 i64PlayHandle, int iMsg, void* pUserData);

private:
    VIDEO_INT64 _filePlayHandle = -1;       //文件播放句柄
	std::string _exefold;  // 不包含最后的“/”或“\\”的exe路径
    CString _filePlayName;
    CStatic _playWnd;
    CListBox _msgList;
    int _filePlayVoice;
    CString _snapFileName;
	int _volumeToSet;
	CButton _useBmpCtrl;
	int _speed;
	int _secondsToSeek;
	int _privateMainType;
	int _privateSubType;
};
