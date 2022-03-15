#pragma once
#include "afxwin.h"


// CInitDialog 对话框

class CInitDialog : public CDialog
{
	DECLARE_DYNAMIC(CInitDialog)

public:
	CInitDialog(CWnd* pParent = NULL);   // 标准构造函数
	virtual ~CInitDialog();

	void NotifyDialogInited(const char* exeFolder = nullptr);

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_DIALOG_INIT };
#endif

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

	DECLARE_MESSAGE_MAP()
	afx_msg void OnOK() {};  // 防止回车后窗口不见了
	afx_msg void OnCancel() {};  // 防止按esc后窗口不见了
	afx_msg void OnBnClickedButtonInit();
	afx_msg void OnBnClickedButtonUninit();
	afx_msg void OnLbnDblclkListPlaybackMsgbox();
	afx_msg int OnCreate(LPCREATESTRUCT lpCreateStruct);
	afx_msg void OnDestroy();
	LRESULT OnNotifyUpdateToken(WPARAM wparam, LPARAM lparam);
	virtual BOOL PreTranslateMessage(MSG* pMsg);

protected:
	void _printMsg(const std::string& func, int ret, int errorCode, ULONGLONG costs);
	void _printMsg(const std::string& msg);
    void _showListHovScollBar();

private:
	CListBox _msgList;
	CToolTipCtrl _toolTip;
};
