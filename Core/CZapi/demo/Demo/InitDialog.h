#pragma once
#include "afxwin.h"


// CInitDialog �Ի���

class CInitDialog : public CDialog
{
	DECLARE_DYNAMIC(CInitDialog)

public:
	CInitDialog(CWnd* pParent = NULL);   // ��׼���캯��
	virtual ~CInitDialog();

	void NotifyDialogInited(const char* exeFolder = nullptr);

// �Ի�������
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_DIALOG_INIT };
#endif

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV ֧��

	DECLARE_MESSAGE_MAP()
	afx_msg void OnOK() {};  // ��ֹ�س��󴰿ڲ�����
	afx_msg void OnCancel() {};  // ��ֹ��esc�󴰿ڲ�����
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
